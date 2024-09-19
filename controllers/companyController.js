const Company = require("../models/companyModel")
const UserModel = require("../models/userModel")
const Adminuser = require("../models/AdminuserModel")


exports.company = async (req, res) => {
    try {
        const { Company_Name, Company_Email, Company_Phone, Company_ID, Company_Address, Company_Type, Other, UserId } = req.body;

        // Assuming UserId is passed in the body, validate or fetch the UserId as needed
        const user = await UserModel.findById(UserId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let existingCompany = await Company.findOne({ Company_ID });

        if (existingCompany) {
            // Update the existing company
            existingCompany.Company_Name = Company_Name;
            existingCompany.Company_Email = Company_Email;
            existingCompany.Company_Phone = Company_Phone;
            existingCompany.Company_Address = Company_Address;
            existingCompany.Company_Type = Company_Type;
            existingCompany.Other = Other;

            await existingCompany.save();

            // Push the company ID into the userModel array if it's not already there
            if (!user.company.includes(existingCompany._id)) {
                user.company.push(existingCompany._id);
                await user.save();
            }

            res.status(200).json({ message: "Company updated successfully", company: existingCompany });
        } else {
            return res.status(404).json({ message: "Company not found" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



exports.update_company = async (req, res) => {
    try {
        const { Company_Name, Company_Email, Company_Phone, Company_Address, Company_Type, Other } = req.body;
        const companyId = req.params.companyId;

        let company = await Company.findOne({ Company_ID: companyId });
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        // Update only the provided fields
        if (Company_Name) company.Company_Name = Company_Name;
        if (Company_Email) company.Company_Email = Company_Email;
        if (Company_Phone) company.Company_Phone = Company_Phone;
        if (Company_Address) company.Company_Address = Company_Address;
        if (Company_Type) company.Company_Type = Company_Type;
        if (Other) company.Other = Other;

        await company.save();

        res.status(200).json({ message: "Company updated successfully", company });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

  
// exports.get_company = async (req, res) => {
//     try {
//         const userId = req.params.userId; // Assuming userId is used to identify the user
//         const user = await UserModel.findById(userId);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const companyId = user.company[0]; // Assuming user can only belong to one company

//         // Populate additional company details from the Company collection
//         const company = await Company.findById(companyId);

//         if (!company) {
//             return res.status(404).json({ message: 'Company not found' });
//         }

//         res.status(200).json({ company });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

exports.get_company = async (req, res) => {
    try {
        const userId = req.params.userId; // Assuming userId is used to identify the user
        let user = await UserModel.findById(userId);

        if (!user) {
            // If user is not found in UserModel, try finding in Adminuser model
            user = await Adminuser.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
        }

        const companyId = user.company[0]; // Assuming user can only belong to one company

        // Populate additional company details from the Company collection
        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        res.status(200).json({ company });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};






  