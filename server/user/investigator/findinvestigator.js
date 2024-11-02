import {InvestigatorModel, investigatorSchema} from '../../model/investigator.model.js'; 
import {ProjectModel} from '../../model/project.model.js';
import express from 'express';


const findInvestigator = express.Router();

findInvestigator.get('/api/findInvestigator/', async (req, res) => {
  try {
    const { searchText, projectCode } = req.query;

    if (!searchText) {
      return res.status(400).json({ message: "Search text is required." });
    }

    const project = await ProjectModel.findOne({ projectCode });
    let investigators;

    if (!project) {
      // If no project, find all matching investigators
      investigators = await InvestigatorModel.find(
        { email: { $regex: searchText, $options: 'i' } },
        { firstname: 1, lastname: 1, email: 1 } // Fetch only the necessary fields
      );
    } else {
      const addedInvestigatorEmails = project.projectInvestigators.map(inv => inv.email);
      console.log(addedInvestigatorEmails);
      investigators = await InvestigatorModel.find(
        {
          email: { $regex: searchText, $options: 'i', $nin: addedInvestigatorEmails } 
        },
        { firstname: 1, lastname: 1, email: 1 } // Fetch only the necessary fields
      );
    }

    if (investigators.length === 0) {
      return res.status(404).json({ message: "No matching investigators found." });
    }

    // Map each investigator to ensure all fields are populated
    const mappedInvestigators = investigators.map(inv => ({
      firstname: inv.firstname || "N/A", // Placeholder if firstname is missing
      lastname: inv.lastname || "N/A",   // Placeholder if lastname is missing
      email: inv.email
    }));

    res.status(200).json(mappedInvestigators);

  } catch (error) {
    console.error("Error fetching investigators:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export {findInvestigator};