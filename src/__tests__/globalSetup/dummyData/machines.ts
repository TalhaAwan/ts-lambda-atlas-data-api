import companies from "./companies.js";
import { IMachineBulkCreate } from "../../../interfaces.mjs";

const machines: IMachineBulkCreate[] = []
for (let i = 0; i < 770; i++) {
  machines.push({
    "name": `Machine name ${i}`,
    "serialCode": `machine-code-${i}`,
    "company": companies[0]._id,
    "description": `Machine description ${i}`,
    "deleted": false,
    "createdAt": {
      "$date": new Date()
    },
    "updatedAt": {
      "$date": new Date()
    },
  });
};


export default machines;