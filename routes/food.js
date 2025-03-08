var express = require("express");
var router = express.Router();
var pool = require("./pool");
var upload = require("./multer");
var LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./scratch");

router.post(
  "/submit_food",
  upload.single("foodlogo"),
  function (req, res, next) {
    pool.query(
      "insert into food (foodcategory_id,foodsubcategory_id,food_name,food_ingredients, food_price, food_offerprice, food_type, food_status ,food_picture) values(?,?,?,?,?,?,?,?,?)",
      [
        req.body.food_category,
        req.body.food_subcategory,
        req.body.foodname,
        req.body.foodingredient,
        req.body.price,
        req.body.offerprice,
        req.body.foodtype,
        req.body.foodstatus,
        req.file.filename,
      ],
      function (error, result) {
        if (error) {
          console.log(error);
          res.render("foodinterface", {
            statu: false,
            Message: "Database Error: Pls Contact With Database Administrator ",
          });
        } else {
          res.render("foodinterface", {
            statu: true,
            Message: "Flight Submitted Successfully",
          });
        }
      }
    );
  }
);

router.post("/edit_delete_food", function (req, res, next) {
  if (req.body.btn == "Edit") {
    pool.query(
      "update food set foodcategory_id=?,foodsubcategory_id=?,food_name=?,food_ingredients=?, food_price=?, food_offerprice=?, food_type=?, food_status=? where food_id=?",
      [
        req.body.food_category,
        req.body.food_subcategory,
        req.body.foodname,
        req.body.foodingredient,
        req.body.price,
        req.body.offerprice,
        req.body.foodtype,
        req.body.foodstatus,
        req.body.foodid,
      ],
      function (error, result) {
        if (error) {
          console.log(error);
          res.redirect("/food/display_food");
        } else {
          console.log(result);
          res.redirect("/food/display_food");
        }
      }
    );
  } else if (req.body.btn == "Delete") {
    pool.query(
      "Delete from food where food_id=?",
      [req.body.foodid],
      function (error, result) {
        if (error) {
          console.log(error);
          res.redirect("/food/display_food");
        } else {
          console.log(result);
          res.redirect("/food/display_food");
        }
      }
    );
  }
});

router.get("/display_for_picture_edit", function (req, res, next) {
  try {
    var data = JSON.parse(localStorage.getItem("ADMIN"));
    if (data == null) {
      res.render("adminlogin", { message: "" });
    } else {
      res.render("displayforpictureedit", { data: req.query });
    }
  } catch {
    res.render("adminlogin", { message: "" });
  }
});

router.post(
  "/edit_food_picture",
  upload.single("foodlogo"),
  function (req, res, next) {
    console.log(req.body);
    console.log(req.file);
    pool.query(
      "update food set food_picture=? where food_id=?",
      [req.file.filename, req.body.foodid],
      function (error, result) {
        if (error) {
          console.log(error);
          res.redirect("/food/display_food");
        } else {
          console.log(result);
          res.redirect("/food/display_food");
        }
      }
    );
  }
);

router.get("/food_interface", function (req, res, next) {
  try {
    var data = JSON.parse(localStorage.getItem("ADMIN"));
    if (data == null) {
      res.render("adminlogin", { message: "" });
    } else {
      res.render("foodinterface", { Message: "" });
    }
  } catch {
    res.render("adminlogin", { message: "" });
  }
});

router.get("/fetch_foodcategory", function (req, res, next) {
  pool.query("select * from foodcategory", function (error, result) {
    if (error) {
      console.log(error);
      res.status(500).json({
        statu: false,
        Message: "Database Error: Pls Contact With Database Administrator ",
      });
    } else {
      res.status(200).json({ data: result, statu: true, Message: "Success" });
    }
  });
});

router.get("/fetch_subfoodcategory", function (req, res, next) {
  pool.query(
    "select * from foodsubcategory where foodcategory_id=?",
    [req.query.foodcategoryid],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(500).json({
          statu: false,
          Message: "Database Error: Pls Contact With Database Administrator ",
        });
      } else {
        res.status(200).json({ data: result, statu: true, Message: "Success" });
      }
    }
  );
});

router.get("/display_food", function (req, res, next) {
  try {
    var data = JSON.parse(localStorage.getItem("ADMIN"));
    if (data == null) {
      res.render("adminlogin", { message: "" });
    } else {
      pool.query("select * from food", function (error, result) {
        if (error) {
          res.render("displayall", {
            status: false,
            Message: "Database Error: Pls Contact With Database Administrator ",
          });
        } else {
          res.render("displayall", {
            data: result,
            status: false,
            Message: "Success",
          });
        }
      });
    }
  } catch (e) {
    res.render("adminlogin", { message: "" });
  }
});

router.get("/display_for_edit", function (req, res, next) {
  try {
    var data = JSON.parse(localStorage.getItem("ADMIN"));
    if (data == null) {
      res.render("adminlogin", { message: "" });
    } else {
      pool.query(
        "select F.*, (select C.foodcategory_name from foodcategory C where C.foodcategory_id = F.foodcategory_id ) as foodcategory , (select S.foodsubcategory_name from foodsubcategory S where S.foodsubcategory_id = F.foodsubcategory_id ) as foodsubcategory from food F where F.food_id=?",
        [req.query.food_id],
        function (error, result) {
          if (error) {
            console.log("a" + error);
            res.render("displayforedit", {
              status: false,
              Message:
                "Database Error: Pls Contact With Database Administrator ",
            });
          } else {
            console.log("b" + result);
            res.render("displayforedit", {
              data: result[0],
              status: false,
              Message: "success",
            });
          }
        }
      );
    }
  } catch {
    res.render("adminlogin", { message: "" });
  }
});

module.exports = router;
