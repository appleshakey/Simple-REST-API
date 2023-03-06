const express = require("express");
const bodyparser = require("body-parser");
const e = require("express");
const app = express();
app.use(bodyparser.json());

//dummy records
let patients = new Object();
patients["546854"] = ["Adam", "Jennson", "123789456"];
patients["546855"] = ["William", "Mark", "113585945"];

let records = new Object();
records["546854"] = "Status : Healthy";
records["546855"] = "Status : Cold";

//record directory
app.get("/records", (req, res) => {
  //verify Patient Exists
  if (patients[req.headers.ssn] == undefined) {
    res.status(404).send({ msg: "Patient not found" });
  }

  if (
    req.headers.firstname == patients[req.headers.ssn][0] &&
    req.headers.lastname == patients[req.headers.ssn][1]
  ) {
    //first & last name match
    if (req.body.reasonforvisit === "medicalrecords") {
      res.status(200).send(records[req.headers.ssn]);
    } else
      res.status(501).send({
        msg:
          "Unable to perform the action at current time " +
          req.body.reasonforvisit,
      });
  } else {
    res.status(403).send({ msg: "Unauthorized access" });
  }

  // Verify first name and last name matches
});

//Create new patient
app.post("/", (req, res) => {
  patients[req.headers.ssn] = [
    req.headers.firstname,
    req.headers.lastname,
    req.headers.phone,
  ];

  res.status(200).send(patients);
});

//Update existing new patient

app.put("/", (req, res) => {
  //authorization
  if (patients[req.headers.ssn] == undefined) {
    res.status(404).send({ msg: "Patient not found" });
  } else {
    if (
      req.headers.firstname == patients[req.headers.ssn][0] &&
      req.headers.lastname == patients[req.headers.ssn][1]
    ) {
      //Updatee the phone number
      patients[req.headers.ssn] = [
        req.headers.firstname,
        req.headers.lastname,
        req.headers.phonenumber,
      ];
      res.status(200).send("The information has been successfully updated.");
    } else {
      res.status(401).send("Not authorized");
    }
  }
});

//delete existing patient

app.delete("/", (req, res) => {
  if (patients[req.headers.ssn] == undefined) {
    res.status(404).send({ msg: "Patient not found" });
  } else {
    if (
      req.headers.firstname == patients[req.headers.ssn][0] &&
      req.headers.lastname == patients[req.headers.ssn][1]
    ) {
      delete patients[req.headers.ssn];
      delete records[req.headers.ssn];
      res
        .status(200)
        .send("The patient information and records are successfully deleted.");
    } else {
      res.status(401).send("Invalid Authorization");
    }
  }
});

app.listen(3000);
