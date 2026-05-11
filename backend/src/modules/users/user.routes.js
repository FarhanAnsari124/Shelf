const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const { protect } = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/upload.middleware");

router.use(protect); 

router.put("/profile", upload.single("avatar"), userController.updateProfile);
router.put("/preferences", userController.updatePreferences);
router.put("/password", userController.changePassword);
router.put("/whatsapp", userController.updateWhatsapp);
router.delete("/deactivate", userController.deactivateAccount);

module.exports = router;
