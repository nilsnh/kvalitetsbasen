# Kvalitetsbasen

Dette prosjektet inneheld eit uttak av
[kvalitetsbasen](https://kvalitetsbasen.app.uib.no) til Universitetet i Bergen.

**Bakgrunnen** for dette prosjektet er at eg i studiene mine ved UiB leverte inn
nokre studieevalueringar. Og då byrja eg å lure på kor desse evalueringane tok
vegen, kva omfanget var og kva for konsekvenser dei får over tid. Etter å ha
blitt tipsa om at UiB samler emneevalueringane i Kvalitetsbasen så spurde eg om
eg kunne få tilgang til dei underliggande dataene.

## Bruksanvisning

1. Last ned dette prosjektet.
1. Installer [docker](https://www.docker.com) og kjør terminalkommando
   `docker-compose up` i prosjektmappen. Det vil starte opp en MySQL 5.5
   kontainer med dataene allerede lagt inn.
1. Tilgangsinfo finner du i `docker-compose.yml` filen. Eks. på
   tilkoplingsstreng: `mysql://root:quality@localhost:3306/uib_quality`

Alternativt: Du kan også importere .sql filene som ligger i data/ mappen i ein
lokal MySQL 5.5 database.

## Spanande spørringer

Når du har databasen oppe og går så kan du bruke ein MySQL klient til å stille
sql spørringer mot dataene.

```
-- How many courses are evaluated per year?
select emn.aar as year, count(*) as evaluted_courses, emn_total.total_courses
from emne_liste emn,
  (select str.kode, CAST(LEFT(rap.filnavn, 4) as INTEGER) year
   from rapport rap, struktur str
   where rap.struktur_id = str.struktur_id) eval,
  (select aar, count(*) as total_courses
   from emne_liste
   GROUP BY aar) emn_total
where emn.emnekode = eval.kode
      and emn.aar = eval.year
      and emn.aar = emn_total.aar
GROUP BY emn.aar
ORDER BY emn.aar DESC;
```

```
-- How many courses are evaluated per semester, per year?
select emn.aar as year, emn.terminkode as term, count(*) as evaluted_courses, emn_total.total_courses
from emne_liste emn,
  (select str.kode, CAST(LEFT(rap.filnavn, 4) as INTEGER) year
   from rapport rap, struktur str
   where rap.struktur_id = str.struktur_id) eval,
  (select aar, terminkode, count(*) as total_courses
   from emne_liste
   GROUP BY aar, terminkode) emn_total
where emn.emnekode = eval.kode
      and emn.aar = eval.year
      and emn.aar = emn_total.aar
      and emn.terminkode = emn_total.terminkode
GROUP BY emn.aar, emn.terminkode
ORDER BY emn.aar DESC;
```

```
-- Count number of reports grouped by year
SELECT DISTINCT CAST(LEFT(rap.filnavn, 4) as INTEGER) as year, count(*) as num_reports_total
FROM rapport rap
GROUP BY year
ORDER BY year DESC;
```

!["Skjermskudd av databaseresultat"](/screenshot.png?raw=true)

Foreslå gjerne andre spørringer å inkludere enten som pull requests til dette
prosjektet eller ved å legge det til som issues. :)

Tips: Dersom du vil laste ned ein rapport så kan du bruke url
`https://kvalitetsbasen.app.uib.no/rapport.php?rapport_id=` og legge til
rapportid på slutten.

## Lisens

Dataene i dette prosjektet er lisensiert under Norsk lisens for offentlige data
(NLOD), [se lisensvilkår](https://data.norge.no/nlod/no) der Universitetet i
Bergen er lisensgiver.
