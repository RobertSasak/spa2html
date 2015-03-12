# spa2html

## Examples

Get a static page of http://spapages.com/coolpage
Simillary for http://spapages.com/#!coolpage

```
http://spa2html.yourserver.com/http://spapages.com/coolpage
```

```
http://spa2html.yourserver.com/https://spapages.com/coolpage
```

```
$ curl --header "x-forwarded-host: spapages.com" http://spa2html.yourserver.com/coolpage
```

```
$ curl --header "referer: http://spapages.com/coolpage" http://spa2html.yourserver.com
```