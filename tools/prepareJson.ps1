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

Function Get-Json-Files {
  Param()
  Begin {}
  Process {
    $articles = New-Object System.Collections.ArrayList
    ls -Filter '*.json' | %{
      $json = $_ | Get-Content -Encoding utf8 | ConvertFrom-Json
      $a = New-Object PSObject -Property @{ 
        date = $json.date_journal;
        file = $_
      }
      $articles.Add( $a ) | Out-Null
    }
    $articles | Sort-Object -Property date | %{$_.file}
  }
}

Function Get-Blog-Json {
  Param(
    [String]$Directory,
    [parameter(Mandatory=$false)][Int] $MapZoom,
    [parameter(Mandatory=$false)][Switch] $Median
  )
  Begin{
    pwd | % { [IO.Directory]::SetCurrentDirectory($_.path) }
  }
  Process{
    $oldPath = (pwd)
    if ($Directory) {
      cd $Directory
    }
    if (-not $MapZoom) {
      $MapZoom = 9
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
    $jsonFiles = Get-Json-Files | % {$_.Name}
    if ($Median) {
      $coords = Get-Median-Coord
    } else {
      $coords = Get-Average-Coord
    }
    New-Object PSObject -Property  @{ 
      mapLon   = $coords.lon
      mapLat   = $coords.lat
      mapZoom  = $MapZoom
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
        if ($_.lat -and $_.lon -and $_.lat -lt 180 -and $_.lon -lt 180) {
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

Function Get-Median-Coord {
  Param()
  Begin {}
  Process {
    $latList = New-Object System.Collections.ArrayList
    $lonList = New-Object System.Collections.ArrayList
    ls .\*.json | %{ 
      $_ | Get-Content -Encoding utf8 | ConvertFrom-Json | % {
        if ($_.lat -and $_.lon -and $_.lat -lt 180 -and $_.lon -lt 180) {
          $latList.Add( $_.lat ) | Out-Null
          $lonList.Add( $_.lon ) | Out-Null
        }
      }
    }
    New-Object PSObject -Property  @{ 
      lat = Get-Median $latList
      lon = Get-Median $lonList
    }
  }
}

function Get-Median{
    <# 
    .Synopsis 
        Gets a median 
    .Description 
        Gets the median of a series of numbers 
    .Example 
        Get-Median 2,4,6,8 
    #>
    param(
    # The numbers to average
    [Parameter(Mandatory=$true,ValueFromPipelineByPropertyName=$true,Position=0)]
    [Double[]]
    $Number
    )
    
    begin {
        $numberSeries = @()
    }
    
    process {
        $numberSeries += $number
    }
    
    end {
        $sortedNumbers = @($numberSeries | Sort-Object)
        if ($numberSeries.Count % 2) {
            # Odd, pick the middle
            $sortedNumbers[($sortedNumbers.Count / 2) - 1]
        } else {
            # Even, average the middle two
            ($sortedNumbers[($sortedNumbers.Count / 2)] + $sortedNumbers[($sortedNumbers.Count / 2) - 1]) / 2
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