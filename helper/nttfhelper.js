var db = require("../config/connection");
var objectId = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");
var XLSX = require("xlsx");

module.exports = {
  doLogin: (userData) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let user = await db.getCp08Db().collection("staffs").findOne({ email: userData.email });
      if(user)
      {
        if (user.password) {
          bcrypt.compare(userData.password, user.password).then((status) => {
            if (status) {
              response.status = true;
              response.user = user;
              resolve(response);
            } else {
              resolve({ status: false });
            }
          });
        } else {
          resolve({ status: false });
        }
      } else {
        resolve({status:false})
      }
    });
  },

  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      userData.password = await bcrypt.hash(userData.password, 10);

      let response = {};

      db.getCp08Db()
        .collection("admin")
        .insertOne(userData)
        .then((data) => {
          resolve(data);
        });
    });
  },

  addTrainee: (trainee) => {
    return new Promise((resolve, reject) => {
      trainee.dob = new Date(trainee.dob);
      db.getCp08Db().collection("trainees").insertOne(trainee);
      console.log(trainee);
      resolve();
    });
  },
  addStaff: (staff) => {
    return new Promise((resolve, reject) => {
      db.getCp08Db().collection("staffs").insertOne(staff);
      resolve();
    });
  },

  addAdmin: (userData) => {
    return new Promise(async (resolve, reject) => {
      userData.password = await bcrypt.hash(userData.password, 10);
      db.getCp08Db()
        .collection("admin")
        .insertOne(userData)
        .then((data) => {
          resolve(data);
        });
    });
  },

  viewTrainee: (traineeId) => {
    return new Promise((resolve, reject) => {
      db.getCp08Db()
        .collection("trainees")
        .findOne({ tokennumber: traineeId })
        .then((trainee) => {
            trainee.dob=dateOnly(trainee.dob)
          
          resolve(trainee);
        });
    });
  },

  getAllTrainee: () => {
    return new Promise(async (resolve, reject) => {
      let trainees = await db
        .getCp08Db()
        .collection("trainees")
        .find()
        .toArray();
      resolve(trainees);
    });
  },
  addBulkTrainees: (trainees) => {
    return new Promise(async (resolve, reject) => {
      var sheet_namelist = trainees.SheetNames;
      var x = 0;
      sheet_namelist.forEach((element) => {
        var xlData = XLSX.utils.sheet_to_json(
          trainees.Sheets[sheet_namelist[x]]
        );
        db.getCp08Db()
          .collection("trainees")
          .insertMany(xlData, (err, data) => {
            if (err) {
              resolve(err);
            } else {
              resolve(data);
              console.log(data);
            }
          });
        x++;
      });
    });
  },
  getAllStaff: () => {
    return new Promise(async (resolve, reject) => {
      let staff = await db.getCp08Db().collection("staffs").find().toArray();
      resolve(staff);
    });
  },
  getStaff: (staffId) => {
    return new Promise(async (resolve, reject) => {
      db.getCp08Db()
        .collection("staffs")
        .findOne({ staffid: staffId })
        .then((data) => {
          resolve(data);
        });
    });
  },
  editTrainee: (traineeId, trainee) => {
    return new Promise((resolve, reject) => {
      trainee.dob = new Date(trainee.dob);
      db.getCp08Db()
        .collection("trainees")
        .updateOne(
          { _id: objectId(traineeId) },
          {
            $set: {
              firstname: trainee.firstname,
              lastname: trainee.lastname,
              email: trainee.email,
              dob: trainee.dob,
              gender: trainee.gender,
              course: trainee.course,
              category: trainee.category,
              quota: trainee.quota,
              tokennumber: trainee.tokennumber,
              aadharnumber: trainee.aadharnumber,
              phonenumber: trainee.phonenumber,
              alternativephonenumber: trainee.alternativephonenumber,
              fathersname: trainee.fathersname,
              fathersphonenumber: trainee.fathersphonenumber,
              mothersname: trainee.mothersname,
              mothersphonenumber: trainee.mothersphonenumber,
              permanentaddress: trainee.permanentaddress,
              currentaddress: trainee.currentaddress,
              city: trainee.city,
              state: trainee.state,
              zip_code: trainee.zip_code,
            },
          }
        )
        .then((response) => {
          resolve(response);
        });
    });
  },
  getTraineeByCourseId: (course, year) => {
    return new Promise(async (resolve, reject) => {
      let trainees = await db
        .getCp08Db()
        .collection("trainees")
        .find({ $and: [{ course: course }, { year: year }] })
        .toArray();
      resolve(trainees);
    });
  },
  getTraineeByCategoryId: (category) => {
    return new Promise(async (resolve, reject) => {
      let trainees = await db
        .getCp08Db()
        .collection("trainees")
        .find({ category: category })
        .toArray();
      resolve(trainees);
    });
  },
  editRole: (staff) => {
    var staffId = staff.staffid;
    return new Promise(async (resolve, reject) => {
      let user = await db
        .getCp08Db()
        .collection("staffs")
        .findOne({ staffid: staffId });

      if (user.admin || user.staff) {
        if (staff.role === "admin") {
          db.getCp08Db()
            .collection("staffs")
            .updateOne(
              { staffid: staffId },
              {
                $set: {
                  admin: true,
                  center: staff.center,
                  course: staff.course,
                },
                $unset: {
                  staff: true,
                },
              }
            );
          resolve();
        } else if (staff.role === "staff") {
          await db
            .getCp08Db()
            .collection("staffs")
            .updateOne(
              { staffid: staffId },
              {
                $set: {
                  staff: true,
                  center: staff.center,
                  course: staff.course,
                },
                $unset: {
                  admin: true,
                },
              }
            );
          resolve();
        } else {
          await db
            .getCp08Db()
            .collection("staffs")
            .updateOne(
              { staffid: staffId },
              {
                $set: {
                  center: staff.center,
                  course: staff.course,
                },
                $unset: {
                  admin: true,
                  staff: true,
                  password: true,
                },
              }
            );
          resolve();
        }
      } else {
        if (staff.role === "admin") {
          db.getCp08Db()
            .collection("staffs")
            .updateOne(
              { staffid: staffId },
              {
                $set: {
                  admin: true,
                  center: staff.center,
                  course: staff.course,
                  password: await bcrypt.hash(user.phone_number, 10),
                },
                $unset: {
                  staff: true,
                },
              }
            );
          resolve();
        } else if (staff.role === "staff") {
          await db
            .getCp08Db()
            .collection("staffs")
            .updateOne(
              { staffid: staffId },
              {
                $set: {
                  staff: true,
                  center: staff.center,
                  course: staff.course,
                  password: await bcrypt.hash(user.phone_number, 10),
                },
                $unset: {
                  admin: true,
                },
              }
            );
          resolve();
        } else {
          await db
            .getCp08Db()
            .collection("staffs")
            .updateOne(
              { staffid: staffId },
              {
                $set: {
                  center: staff.center,
                  course: staff.course,
                },
                $unset: {
                  admin: true,
                  staff: true,
                },
              }
            );
          resolve();
        }
      }
    });
  },
};

function dateOnly(date) {
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  return day + "/" + month + "/" + year;
}
