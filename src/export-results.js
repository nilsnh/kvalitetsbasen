require("dotenv").config();
const mysql = require("mysql2/promise");
const fetch = require("node-fetch");
const bluebird = require("bluebird");
const fs = require("fs");
const path = require("path");

main();

/**
 *  Purpose: Export .json to be used by elm frontend.
 */
async function main() {
  console.log("Starting work");
  const results = await doQuery(
    `select emn.aar as year, emn.terminkode as term, count(*) as evaluted_courses, emn_total.total_courses
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
      ORDER BY emn.aar DESC;`
  );
  fs.writeFileSync(
    path.join(__dirname, "../src-elm/data.json"),
    JSON.stringify(results)
  );
  console.log("Done with work");
}

async function doQuery(query) {
  const connection = await mysql.createConnection(
    "mysql://root:quality@localhost:3306/uib_quality"
  );
  try {
    const [results, fields] = await connection.query(query);
    return results;
  } catch (e) {
    console.log("Failed to run sql script", e);
  } finally {
    await connection.end();
  }
}
