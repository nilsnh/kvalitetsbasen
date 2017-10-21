# Kvalitetsbasen

Dette prosjektet inneheld eit uttak av [kvalitetsbasen](https://kvalitetsbasen.app.uib.no) til Universitetet i Bergen.

## Bruksanvisning

1. Last ned dette prosjektet.
1. Installer [docker](https://www.docker.com) og kjør terminalkommando `docker-compose up` i prosjektmappen. Det vil starte opp en MySQL 5.5 kontainer med dataene allerede lagt inn.
1. Tilgangsinfo finner du i `docker-compose.yml` filen. Eks. på tilkoplingsstreng: `mysql://root:quality@localhost:3306/uib_quality`

Alternativt: Du kan også importere .sql filen som ligger i data/ mappen i ein lokal MySQL 5.5 database.

## Spanande spørringer

Når du har databasen oppe og går så kan du bruke en MySQL klient til å stille spørringer mot dataene.

```
-- Count number of reports grouped by year
SELECT DISTINCT CAST(LEFT(rap.filnavn, 4) as INTEGER) as year, count(*) as num_reports_total
FROM rapport rap
GROUP BY year
ORDER BY year DESC;
```

Foreslå gjerne andre spørringer å inkludere enten som pull requests til dette prosjektet eller ved å legge det til som issues. :)

Tips: Dersom du vil laste ned ein rapport så kan du bruke url `https://kvalitetsbasen.app.uib.no/rapport.php?rapport_id=` og legge til rapportid på slutten.

## Lisens

Dataene i dette prosjektet er lisensiert under Norsk lisens for offentlige data (NLOD), [se lisensvilkår](https://data.norge.no/nlod/no) der Universitetet i Bergen er lisensgiver.
