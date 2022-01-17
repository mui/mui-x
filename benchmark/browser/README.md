# Browser benchmark

This project is used when running the following command:

```sh
yarn browser
```

It is supposed to give developers comparable values between running different scenarios inside the browser, that can be found in the `./scenarios` folder.

You should use these numbers exclusively for comparing performance between different scenarios, not as absolute values.

## Output

```
React Virtualized:
  Vertical scroll:
       Min: 44.916 fps (σ = 22.443)
       Max: 104.586 fps (σ = 2.355)
    Median: 91.986 fps (σ = 0.62)
      Mean: 92.574 fps (σ = 0.608)
  Horizontal scroll:
       Min: 56.892 fps (σ = 14.997)
       Max: 104.776 fps (σ = 2.154)
    Median: 91.638 fps (σ = 0.457)
      Mean: 92.243 fps (σ = 0.483)
AG Grid:
  Vertical scroll:
       Min: 32.022 fps (σ = 3.244)
       Max: 107.518 fps (σ = 3.032)
    Median: 85.4 fps (σ = 0.603)
      Mean: 76.698 fps (σ = 0.861)
  Horizontal scroll:
       Min: 22 fps (σ = 2.898)
       Max: 102.955 fps (σ = 1.893)
    Median: 51.985 fps (σ = 0.184)
      Mean: 52.875 fps (σ = 0.111)
MUI+:
  Vertical scroll:
       Min: 76.206 fps (σ = 6.51)
       Max: 100.848 fps (σ = 0.613)
    Median: 89.708 fps (σ = 0.11)
      Mean: 89.68 fps (σ = 0.134)
  Horizontal scroll:
       Min: 71.149 fps (σ = 7.803)
       Max: 104.896 fps (σ = 2.085)
    Median: 87.821 fps (σ = 0.392)
      Mean: 88.173 fps (σ = 0.313)
DataGridPro:
  Vertical scroll:
       Min: 29.997 fps (σ = 2.15)
       Max: 107.312 fps (σ = 1.512)
    Median: 80.123 fps (σ = 0.332)
      Mean: 86.283 fps (σ = 0.525)
  Horizontal scroll:
       Min: 25.424 fps (σ = 0.633)
       Max: 114.815 fps (σ = 2.918)
    Median: 63.302 fps (σ = 0.847)
      Mean: 86.905 fps (σ = 0.652)
```
