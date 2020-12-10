const router = require("express").Router();
const Event = require("../models/Event");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
    try {
        const events = await Event.find({ user: req.user._id }).populate("user").sort({date: -1});
        res.send(events);
    } catch (e) {
        res.sendStatus(500);
    };
});

router.post("/", auth, async (req, res) => {
    const data = {
        ...req.body,
        user: req.user._id,
    };
    try {
        const event = new Event(data);
        await event.save();
        res.send(event);
    } catch (e) {
        return res.status(400).send(e);
    }
});

router.delete("/:id", auth, async (req, res) => {
    const event = await Event.findById(req.params.id);
    try {
        await event.remove();
        res.send({ message: "Success" });
    } catch (e) {
        return res.status(400).send(e);
    }
});


module.exports = router;