import mongoose from 'mongoose'; 

const CompanySchema = new mongoose.Schema({
  stateCode: { type: String, default: null },
  cin: {
    type: String,
    trim: true,
    index: true,
 },
  company: { type: String, default: null },
  companyType: { type: String, default: null },
  companyOrigin: { type: String, default: null },
  registrationNumber: { type: mongoose.Schema.Types.Mixed, default: null },
  dateOfIncorporation: { type: String, default: null },
  emailAddress: { type: String, default: null },
  whetherListedOrNot: { type: String, default: null },
  companyCategory: { type: String, default: null },
  companySubcategory: { type: String, default: null },
  classOfCompany: { type: String, default: null },
  authorisedCapital: { type: Number, default: null },
  paidUpCapital: { type: Number, default: null },
  mainDivision: { type: Number, default: null },
  mainDivisionDescription: { type: String, default: null },

  streetAddress: { type: String, default: null },
  streetAddress2: { type: String, default: null },
  city: { type: String, default: null },
  state: { type: String, default: null },
  postalCode: { type: mongoose.Schema.Types.Mixed, default: null },
  addressType: { type: String, default: null },

  DirectorDIN: { type: mongoose.Schema.Types.Mixed, default: null },
  DirectorFirstName: { type: String, default: null },
  DirectorLastName: { type: String, default: null },
  DirectorEmailAddress: { type: String, default: null },
  DirectorMobileNumber: { type: mongoose.Schema.Types.Mixed, default: null },

  DirectorPermanentAddressLine1: { type: String, default: null },
  DirectorPermanentAddressLine2: { type: String, default: null },
  DirectorPermanentCity: { type: String, default: null },
  DirectorPermanentState: { type: String, default: null },
  DirectorPermanentPincode: { type: mongoose.Schema.Types.Mixed, default: null },

  DirectorPresentAddressLine1: { type: String, default: null },
  DirectorPresentAddressLine2: { type: String, default: null },
  DirectorPresentCity: { type: String, default: null },
  DirectorPresentState: { type: String, default: null },
  DirectorPresentPincode: { type: mongoose.Schema.Types.Mixed, default: null },

  // Add field to store the original filename
  sourceFileName: {
    type: String,
    index: true, // Index for faster checking
  }

});

// This pattern prevents redefining the model during hot reloads in development
const Company = mongoose.models.Company || mongoose.model('Company', CompanySchema);

export default Company;
