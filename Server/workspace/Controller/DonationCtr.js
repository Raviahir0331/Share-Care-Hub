const Donation = require('../Model/DonationModel');

// Create a new donation
exports.createDonation = async (req, res) => {
  try {
    const newDonation = new Donation({
      ...req.body,
      donationImage: req.file.path // Save the file path in the database
    });
    const savedDonation = await newDonation.save();
    res.status(201).json(savedDonation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all donations
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find();
    res.status(200).json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single donation by ID
exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    res.status(200).json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a donation by ID
exports.updateDonation = async (req, res) => {
  try {
    const updatedDonation = await Donation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDonation) return res.status(404).json({ message: 'Donation not found' });
    res.status(200).json(updatedDonation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a donation by ID
exports.deleteDonation = async (req, res) => {
  try {
    const deletedDonation = await Donation.findByIdAndDelete(req.params.id);
    if (!deletedDonation) return res.status(404).json({ message: 'Donation not found' });
    res.status(200).json({ message: 'Donation deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
