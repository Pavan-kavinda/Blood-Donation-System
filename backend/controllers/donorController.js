const Donor = require('../models/Donor');

exports.registerDonor = async(req, res) =>{
    try{
        const newDonor = new Donor(req.body);
        await newDonor.save();
        res.status(201).json({message:"Donor registered!",donor: newDonor});
    }catch(error){
        res.status(400).json({error:error.message});
    }
};

exports.getAllDonors = async (req,res) => {
    try{
        const donors =await Donor.find();
        res.status(200).json(donors);
    }catch (error){
        res.status(500).json({ error: error.message});
    }
};

exports.updateDonor = async (req, res) =>{
    try{
        const updatedDonor = await Donor.findByIdAndUpdate(req.params.id, req.body,{ new: true});
        res.status(200).json(updatedDonor);
    }catch (error){
        res.status(400).json({ error: error.message});
    }
};

exports.deleteDonor = async(req, res) =>{
    try{
        await Donor.findByIdAndDelete(req.params.id);
        res.status(500).json({ message: "Donor deleted successfully!" });
    }catch (error){
        res.status(500).json({error: error.message });
    }
};