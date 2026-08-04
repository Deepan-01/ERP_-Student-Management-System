const router = require("express").Router();
const auth = require("../controllers/authController");

router.post("/register", auth.register);
router.post("/login", auth.login);
router.get("/captcha", auth.getCaptcha);
router.post("/student-login", auth.studentLogin);

module.exports = router;
