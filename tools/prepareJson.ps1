Function Get-Image {
  begin {
    Add-Type -assembly System.Drawing
    pwd | % { [IO.Directory]::SetCurrentDirectory($_.path) }
  }
  process {
    $fi=[System.IO.FileInfo]$_
    if( $fi.Exists) {
      $img = [System.Drawing.Image]::FromFile($_)
      $img.Clone()
      $img.Dispose()
    } else {
      Write-Host "File not found: $_" -fore yellow
    }
  }
}

Function Get-Blog-Json {
  Param(
    [String]$Directory,
    [parameter(Mandatory=$false)][Int] $mapZoom
  )
  Begin{
    pwd | % { [IO.Directory]::SetCurrentDirectory($_.path) }
  }
  Process{
    $oldPath = (pwd)
    if ($Directory) {
      cd $Directory
    }
    if (-not $mapZoom) {
      $mapZoom = 9
    }
    $photos = ls * -include *.jpg, *.png | ? {-not ($_.name -like 'resized_*.*')} | %{
      $image = $_ | Get-Image
      New-Object PSObject -Property  @{ 
        Name      = $_.Name
        Miniature = "resized_" + $_.Name
        Height    = $image.Height
        Width     = $image.Width
      }
    }
    $jsonFiles = ls -Filter '*.json' | % {$_.Name}
    $coords = Get-Average-Coord
    New-Object PSObject -Property  @{ 
      mapLon   = $coords.lon
      mapLat   = $coords.lat
      mapZoom  = $mapZoom
      articles = $jsonFiles
      photos   = $photos
    } | ConvertTo-Json
    cd $oldPath
  }
}

Function Get-Average-Coord {
  Param()
  Begin {}
  Process {
    $lat   = 0
    $lon   = 0
    $count = 0
    ls .\*.json | %{ 
      $_ | Get-Content -Encoding utf8 | ConvertFrom-Json | % {
        if ($_.lat -and $_.lon) {
          $lat += $_.lat
          $lon += $_.lon
          $count += 1
        }
      }
    }
    if ($count -gt 0) {
      $lat /= $count
      $lon /= $count
    }
    New-Object PSObject -Property  @{ 
      lat = $lat
      lon = $lon
    }
  }
}

Function Get-Rss {
  Param(
    [parameter(Mandatory=$true)][String]$Directory,
    [parameter(Mandatory=$true)][String]$MainJson
  )
  Begin{
    pwd | % { [IO.Directory]::SetCurrentDirectory($_.path) }
  }
  Process{
    $mj = Get-Content $MainJson -Encoding utf8 | ConvertFrom-Json 
    $oldPath = (pwd)
    if ($Directory) {
      cd $Directory
    }
    $result = '<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0"><channel>
      <title>Przygoda przygoda</title>
      <link>https://journey-2f55e.firebaseapp.com/reunion</link>
      <description>...przygoda</description>
'
    $mj.articles | %{$result += Get-Rss-Element -JsonFileName $_ -Link 'https://journey-2f55e.firebaseapp.com/reunion'}
    $result += '</channel></rss>'
    cd $oldPath
    $result
  }
}

function Get-Rss-Element{
  Param(
    [parameter(Mandatory=$true)][String]$JsonFileName,
    [parameter(Mandatory=$true)][String]$Link
  )
  Begin{}
  Process{
    $j     = Get-Content $JsonFileName -Encoding utf8 | ConvertFrom-Json
    $title = ($j.text -split '\n')[0]
    $link  = $Link+'#'+$JsonFileName
    $desc  = $j.text
    "  <item>
    <title>${title}</title>
    <link>${link}</link>
    <description>${desc}</description>
  </item>
"
  }
}