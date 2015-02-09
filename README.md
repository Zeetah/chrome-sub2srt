![alt tag](https://travis-ci.org/Zeetah/chrome-sub2srt.svg?branch=master)
# chrome-sub2srt

Chrome extension to convers subtitle files from .sub to .srt

You can drag & drop files to application or use the choose button. After choosing a file to convert the application asks a place to write the output.

#####Example .sub file

```
{1}{1}23.976
{131}{263}This is the first subtitle line.
{272}{326}Second line.
{330}{449}Third line.|Splitted.
```

#####Converts to .srt file as shown below.

```
1
00:00:00,042 --> 00:00:00,042
23.976

2
00:00:05,464 --> 00:00:10,969
This is the first subtitle line.

3
00:00:11,345 --> 00:00:13,597
Second line.
4
00:00:13,764 --> 00:00:18,727
Third line.|Splitted.
```