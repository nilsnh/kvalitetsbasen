require("dotenv").config();
const mysql = require("mysql2/promise");
const fetch = require("node-fetch");
const bluebird = require("bluebird");

main();

/**
 *  Download course overview and update table 'emne_liste'
 */
async function main() {
  console.log("Starting work");
  await bluebird.all([2015, 2016, 2017].map(year => importYear(year)));
  console.log("Done with work");
}

async function importYear(year) {
  try {
    const data = await downloadYear(year);
    console.log(`Downloaded courses for ${year}`);
    await importCourses({ year, courses: buildCourseArray(data) });
    console.log(`Updated total courses for ${year}`);
  } catch (e) {
    console.error(`Failed to import courses for ${year}`, e.message);
  }
}

function downloadYear(year) {
  const apiKey = process.env.UIB_KEY;
  const baseUrl = `https://fs.data.uib.no/${apiKey}/json/littl_emne/`;
  const spring = `${year}V`;
  const fall = `${year}H`;
  return bluebird
    .all([
      fetch(baseUrl + spring).then(res => res.json()),
      fetch(baseUrl + fall).then(res => res.json())
    ])
    .then(([springData, fallData]) => springData.emne.concat(fallData.emne));
}

function buildCourseArray(courseJsonData) {
  return courseJsonData.reduce(
    (
      acc,
      { emnekode, emnenavn_nynorsk, faknavn_nynorsk, arstall, terminkode }
    ) => {
      acc.push([
        emnekode,
        emnenavn_nynorsk,
        faknavn_nynorsk,
        arstall,
        terminkode
      ]);
      return acc;
    },
    []
  );
}

async function importCourses({ year, courses }) {
  const connection = await mysql.createConnection(
    "mysql://root:quality@localhost:3306/uib_quality"
  );
  try {
    await connection.query("START TRANSACTION");
    await connection.query(`delete from emne_liste where aar = ?`, [[year]]);
    const { results, fields } = await connection.query(
      `INSERT INTO emne_liste (emnekode, emnenavn_nynorsk, faknavn_nynorsk, aar, terminkode) VALUES ? `,
      [courses]
    );
    await connection.query("COMMIT");
  } catch (e) {
    await connection.query("ROLLBACK");
    console.log("Failed to import courses, rolled back transaction", e);
  } finally {
    await connection.end();
  }
}
