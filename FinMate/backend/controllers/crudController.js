function createCrudController(Model) {
  async function list(req, res) {
    try {
      const records = await Model.find({ userId: req.user.id }).sort({
        createdAt: -1,
      });
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async function create(req, res) {
    try {
      const record = await Model.create({ ...req.body, userId: req.user.id });
      res.status(201).json(record);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async function update(req, res) {
    try {
      const record = await Model.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { $set: req.body },
        { new: true, runValidators: true },
      );

      if (!record) {
        return res.status(404).json({ message: "Record not found" });
      }

      res.json(record);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async function remove(req, res) {
    const record = await Model.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Deleted" });
  }

  return { list, create, update, remove };
}

module.exports = createCrudController;
