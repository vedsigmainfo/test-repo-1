const sortByList = [{ key: "average_apr", text: "Est. APR*", label: "Est. APR*" },
{ key: "monthly_payment", text: "Est. monthly payment*", label: "Est. monthly payment*" },
{ key: "credit_score", text: "Min credit score", label: "Min credit score" }];

const sortByOfferList = [
    { key: "term_l_h", text: "Term (Low to High)", label: "Term (Low to High)" },
    { key: "term_h_l", text: "Term (High to Low)", label: "Term (High to Low)" },
    { key: "loanamount_l_h", text: "Loan Amount (Low to High)", label: "Loan Amount (Low to High)" },
    { key: "loanamount_h_l", text: "Loan Amount (High to Low)", label: "Loan Amount (High to Low)" },
    { key: "apr_l_h", text: "APR (Low to High)", label: "APR (Low to High)" },
    { key: "monthly_payment_l_h", text: "Monthly Payment (Low to High)", label: "Monthly Payment (Low to High)" }
    //{ key: "est_rate_fees_l_h", text: "Estimated Interest/Fees (Low to High)", label: "Estimated Interest/Fees (Low to High)" },
];

const sortByOfferList1 = [
    // { key: "default", text: "Default", label: "Default" },
    { key: "term_l_h", text: "Term (Low to High)", label: "Term (Low to High)" },
    { key: "term_h_l", text: "Term (High to Low)", label: "Term (High to Low)" },
    { key: "loanamount_l_h", text: "Loan Amount (Low to High)", label: "Loan Amount (Low to High)" },
    { key: "loanamount_h_l", text: "Loan Amount (High to Low)", label: "Loan Amount (High to Low)" },
    { key: "apr_l_h", text: "APR (Low to High)", label: "APR (Low to High)" },
    { key: "monthly_payment_l_h", text: "Monthly Payment (Low to High)", label: "Monthly Payment (Low to High)" }
   ];  

const defaultValues = {
    defaultSelect: "Select",
    loanPurpose: "Select",
    creditScore: "680-719", // Good
    sortBy: "term_l_h"
}
const PrimaryProjectPurpose = [{ key: "Select", text: "Select", label: "Select", plKey: "ALL" },
{ key: "HVAC", text: "HVAC", label: "HVAC", plKey: "HVAC" },
{ key: "Windows & Doors", text: "Windows & Doors", label: "Windows & Doors", plKey: "Windows_&_Doors" },
{ key: "Roofing", text: "Roofing", label: "Roofing", plKey: "Roofing" },
{ key: "Siding", text: "Siding", label: "Siding", plKey: "Siding" },
{ key: "Flooring", text: "Flooring", label: "Flooring", plKey: "Flooring" },
{ key: "Patios", text: "Patios", label: "Patios", plKey: "Patios" },
{ key: "Sunrooms & Room Additions", text: "Sunrooms & Room Additions", label: "Sunrooms & Room Additions", plKey: "Sunrooms & Room Additions" },
{ key: "Fence & Decking", text: "Fence & Decking", label: "Fence & Decking", plKey: "Fence & Decking" },
{ key: "Basements", text: "Basements", label: "Basements", plKey: "Basements" },
{ key: "Other Interior Remodeling", text: "Other Interior Remodeling", label: "Other Interior Remodeling", plKey: "Other Interior Remodeling" },
{ key: "Other Exterior Remodeling", text: "Other Exterior Remodeling", label: "Other Exterior Remodeling", plKey: "Other Exterior Remodeling" },
{ key: "Solar", text: "Solar", label: "Solar", plKey: "Solar" },
{ key: "Other", text: "Other", label: "Other", plKey: "OTHER" }
];

// LOAN APPLICATION -- LIST //
const stateList = [{ key: "Select", text: "Select State", label: "Select State" },
{key: "Alabama", text: "Alabama", label : "Alabama"},
{key: "Alaska", text: "Alaska", label: "Alaska"},
{key: "American Samoa",text: "American Samoa",label: "American Samoa"},
{key: "Arizona",text: "Arizona",label: "Arizona"},
{key: "Arkansas",text: "Arkansas",label: "Arkansas"},
{key: "California",text: "California",label: "California"},
{key: "Colorado",text: "Colorado",label: "Colorado"},
{key: "Connecticut",text: "Connecticut",label: "Connecticut"},
{key: "Delaware",text: "Delaware",label: "Delaware"},
{key: "District Of Columbia",text: "District Of Columbia",label: "District Of Columbia"},
// {key: "Federated States Of Micronesia",text: "Federated States Of Micronesia",label: "Federated States Of Micronesia"},
{key: "Florida",text: "Florida",label: "Florida"},
{key: "Georgia",text: "Georgia",label: "Georgia"},
{key: "Guam",text: "Guam",label: "Guam"},
{key: "Hawaii",text: "Hawaii",label: "Hawaii"},
{key: "Idaho",text: "Idaho",label: "Idaho"},
{key: "Illinois",text: "Illinois",label: "Illinois"},
{key: "Indiana",text: "Indiana",label: "Indiana"},
{key: "Iowa",text: "Iowa",label: "Iowa"},
{key: "Kansas",text: "Kansas",label: "Kansas"},
{key: "Kentucky",text: "Kentucky",label: "Kentucky"},
{key: "Louisiana",text: "Louisiana",label: "Louisiana"},
{key: "Maine",text: "Maine",label: "Maine"},
{key: "Marshall Islands",text: "Marshall Islands",label: "Marshall Islands"},
{key: "Maryland",text: "Maryland",label: "Maryland"},
{key: "Massachusetts",text: "Massachusetts",label: "Massachusetts"},
{key: "Michigan",text: "Michigan",label: "Michigan"},
{key: "Minnesota",text: "Minnesota",label: "Minnesota"},
{key: "Mississippi",text: "Mississippi",label: "Mississippi"},
{key: "Missouri",text: "Missouri",label: "Missouri"},
{key: "Montana",text: "Montana",label: "Montana"},
{key: "Nebraska",text: "Nebraska",label: "Nebraska"},
{key: "Nevada",text: "Nevada",label: "Nevada"},
{key: "New Hampshire",text: "New Hampshire",label: "New Hampshire"},
{key: "New Jersey",text: "New Jersey",label: "New Jersey"},
{key: "New Mexico",text: "New Mexico",label: "New Mexico"},
{key: "New York",text: "New York",label: "New York"},
{key: "North Carolina",text: "North Carolina",label: "North Carolina"},
{key: "North Dakota",text: "North Dakota",label: "North Dakota"},
// {key: "Northern Mariana Islands",text: "Northern Mariana Islands",label: "Northern Mariana Islands"},
{key: "Ohio",text: "Ohio",label: "Ohio"},
{key: "Oklahoma",text: "Oklahoma",label: "Oklahoma"},
{key: "Oregon",text: "Oregon",label: "Oregon"},
{key: "Palau",text: "Palau",label: "Palau"},
{key: "Pennsylvania",text: "Pennsylvania",label: "Pennsylvania"},
{key: "Puerto Rico",text: "Puerto Rico",label: "Puerto Rico"},
{key: "Rhode Island",text: "Rhode Island",label: "Rhode Island"},
{key: "South Carolina",text: "South Carolina",label: "South Carolina"},
{key: "South Dakota",text: "South Dakota",label: "South Dakota"},
{key: "Tennessee",text: "Tennessee",label: "Tennessee"},
{key: "Texas",text: "Texas",label: "Texas"},
{key: "Utah",text: "Utah",label: "Utah"},
{key: "Vermont",text: "Vermont",label: "Vermont"},
{key: "Virgin Islands",text: "Virgin Islands",label: "Virgin Islands"},
{key: "Virginia",text: "Virginia",label: "Virginia"},
{key: "Washington",text: "Washington",label: "Washington"},
{key: "West Virginia",text: "West Virginia",label: "West Virginia"},
{key: "Wisconsin",text: "Wisconsin",label: "Wisconsin"},
{key: "Wyoming",text: "Wyoming",label: "Wyoming"}
];


const stateHWList = [{ key: "Select", text: "Select State", label: "Select State" },
{ key: "Alabama", text: "Alabama", label: "Alabama" },
{ key: "Alaska", text: "Alaska ", label: "Alaska" },
{ key: "Arkansas", text: "Arkansas ", label: "Arkansas" },
{ key: "California", text: "California ", label: "California" },
{ key: "Colorado", text: "Colorado ", label: "Colorado" },
{ key: "Delaware", text: "Delaware", label: "Delaware" },
{ key: "Florida", text: "Florida", label: "Florida" },
{ key: "Georgia", text: "Georgia", label: "Georgia" },
{ key: "Hawaii", text: "Hawaii", label: "Hawaii" },
{ key: "Idaho", text: "Idaho", label: "Idaho" },
{ key: "Illinois", text: "Illinois", label: "Illinois" },
{ key: "Indiana", text: "Indiana", label: "Indiana" },
{ key: "Iowa", text: "Iowa", label: "Iowa" },
{ key: "Kansas", text: "Kansas", label: "Kansas" },
{ key: "Kentucky", text: "Kentucky", label: "Kentucky" },
{ key: "Louisiana", text: "Louisiana", label: "Louisiana" },
// { key: "Maine", text: "Maine", label: "Maine" },
{ key: "Michigan", text: "Michigan", label: "Michigan" },
{ key: "Minnesota", text: "Minnesota", label: "Minnesota" },
{ key: "Mississippi", text: "Mississippi", label: "Mississippi" },
{ key: "Missouri", text: "Missouri", label: "Missouri" },
{ key: "Montana", text: "Montana", label: "Montana" },
{ key: "New Mexico", text: "New Mexico", label: "New Mexico" },
{ key: "New York", text: "New York", label: "New York" },
{ key: "Ohio", text: "Ohio", label: "Ohio" },
{ key: "South Carolina", text: "South Carolina", label: "South Carolina" },
{ key: "South Dakota", text: "South Dakota", label: "South Dakota" },
{ key: "Tennessee", text: "Tennessee", label: "Tennessee" },
{ key: "Texas", text: "Texas", label: "Texas" },
{ key: "Utah", text: "Utah", label: "Utah" },
{ key: "Virginia", text: "Virginia", label: "Virginia" },
{ key: "Washington", text: "Washington", label: "Washington" },
{ key: "Wisconsin", text: "Wisconsin", label: "Wisconsin" },
{ key: "Wyoming", text: "Wyoming", label: "Wyoming" }
];

const housingList = [
{ key: "OWN_WITH_MORTGAGE", text: "Own – with mortgage", label: "Own – with mortgage", tabIndex:"1" },
{ key: "OWN_NO_MORTGAGE", text: "Own – no mortgage", label: "Own – no mortgage", tabIndex:"2" },
{ key: "RENT", text: "Rent", label: "Rent", tabIndex:"3" },
{ key: "LIVING_RENT_FREE", text: "Living rent free", label: "Living rent free", tabIndex:"4" }
];

const employmentList = [
{ key: "FULL_TIME", text: "Full Time", label: "Full Time", tabIndex:"1" },
{ key: "PART_TIME", text: "Part Time", label: "Part Time", tabIndex:"2" },
{ key: "SELF_EMPLOYED", text: "Self Employed", label: "Self Employed", tabIndex:"3" },
// { key: "MILITARY", text: "Military", label: "Military" },
{ key: "RETIRED", text: "Retired", label: "Retired", tabIndex:"4" },
{ key: "STUDENT", text: "Student", label: "Student", tabIndex:"5" },
{ key: "UNEMPLOYED", text: "Unemployed", label: "Unemployed", tabIndex:"6" },
{ key: "OTHER", text: "Other Income", label: "Other Income", tabIndex:"7" }
];

const citizenshipStatusList = [{ key: "Select", text: "Select", label: "Select" },
{ key: "CITIZEN", text: "Citizen", label: "Citizen" },
{ key: "PERMANENT_RESIDENT", text: "Permanent Resident", label: "Permanent Resident" },
{ key: "OTHER", text: "Other", label: "Other" }
];

const highestEducationList = [{ key: "Select", text: "Select", label: "Select" },
{ key: "Highschool", text: "High school", label: "High school" },
{ key: "Associate", text: "Associate", label: "Associate" },
{ key: "Bachelors", text: "Bachelors", label: "Bachelors" },
{ key: "Masters", text: "Masters", label: "Masters" },
{ key: "MBA", text: "MBA", label: "MBA" },
{ key: "PhD", text: "PhD", label: "PhD" },
{ key: "JD", text: "JD", label: "JD" },
{ key: "DDS", text: "DDS", label: "DDS" },
{ key: "MD", text: "MD", label: "MD" }
];

const estimatedCreditScoreList = [
{ key: "720-850", text: "Excellent (720-850)", label: "Excellent (720-850)", tabIndex:"1" },
{ key: "680-719", text: "Good (680-719)", label: "Good (680-719)", tabIndex:"2" },
{ key: "620-679", text: "Average (620-679)", label: "Average (620-679)", tabIndex:"3" },
{ key: "350-619", text: "Poor (below 620)", label: "Poor (below 620)", tabIndex:"4" },
];

const timeAtCurrentAddressList = [
{ key: "0 to 3 months", text: "0 to 3 months", label: "0 to 3 months", tabIndex:"1" },
{ key: "3 to 6 months", text: "3 to 6 months", label: "3 to 6 months", tabIndex:"2" },
{ key: "6 to 9 months", text: "6 to 9 months", label: "6 to 9 months", tabIndex:"3" },
{ key: "9 to 12 months", text: "9 to 12 months", label: "9 to 12 months", tabIndex:"4" },
{ key: "1 to 3 years", text: "1 to 3 years", label: "1 to 3 years", tabIndex:"5" },
{ key: "More than 3 years", text: "More than 3 years", label: "More than 3 years", tabIndex:"6" },
];

const anyMilitaryServiceList = [{ key: "Select", text: "Select", label: "Select" },
{ key: "YES", text: "Yes", label: "Yes" },
{ key: "NO", text: "No", label: "No" },
];

const loanPurposeList1 = [{ key: "Select", text: "Select", label: "Select a loan purpose", plKey: "ALL" },
{ key: "Debt Consolidation", text: "Debt Consolidation", label: "Debt Consolidation", plKey: "CONSOLIDATE_DEBT" },
{ key: "Credit Card Refinancing", text: "Credit Card Refinancing", label: "Credit Card Refinancing", plKey: "REFINANCE_CREDIT_CARD" },
{ key: "Vacation", text: "Vacation", label: "Vacation", plKey: "VACATION" },
{ key: "Moving", text: "Moving", label: "Moving", plKey: "MOVING" },
{ key: "Auto Expense", text: "Auto Expense", label: "Auto Expense", plKey: "AUTO_EXPENSE" },
{ key: "Medical Expense", text: "Medical Expense", label: "Medical Expense", plKey: "MEDICAL_EXPENSE" },
{ key: "Education Expense", text: "Education Expense", label: "Education Expense", plKey: "EDUCATION_EXPENSE" },
{ key: "Business Funding", text: "Business Funding", label: "Business Funding", plKey: "BUSINESS" },
{ key: "Wedding", text: "Wedding", label: "Wedding", plKey: "WEDDING" },
{ key: "Home Improvement", text: "Home Improvement", label: "Home Improvement", plKey: "HOME_IMPROVEMENT" },
{ key: "Other", text: "Other", label: "Other", plKey: "OTHER" }
];
 
const POBox = [ { key: 'po box', value : 'po box'},
				{ key: 'p.o.', value : 'p.o.'},
				{ key: 'p. o.', value : 'p. o.'},
                { key: 'p.o. box', value : 'p.o. box'},
                { key: 'box', value : 'box'}
];

const salaryPeriod = [
    { key: "Select", text: "Select", label: "Salary Frequency", plKey: "Select" },
    { key: "weekly", text: "Weekly", label: "Weekly", plKey: "Weekly" },
    { key: "monthly", text: "Monthly", label: "Monthly", plKey: "Monthly" },
    { key: "yearly", text: "Yearly", label: "Yearly", plKey: "Yearly" },
];

const AddCoborrower = [
    { key: "Yes", text: "Yes", label: "Yes", tabIndex:"1" },
    { key: "No, Continue", text: "No, Continue", label: "No, Continue", tabIndex:"2" },
];

const SubLoanPurpose = [{ key: "Select", text: "Select", label: "Select", plKey: "ALL" },
{ key: "Facial Injectables", text: "Facial Injectables", label: "Facial Injectables", plKey: "Facial Injectables" },
{ key: "Facial Rejuvenation", text: "Facial Rejuvenation", label: "Facial Rejuvenation", plKey: "Facial Rejuvenation" },
{ key: "Skin Tightening", text: "Skin Tightening", label: "Skin Tightening", plKey: "Skin Tightening" },
{ key: "Body Contouring", text: "Body Contouring", label: "Body Contouring", plKey: "Body Contouring" },
{ key: "Cellulite Reduction", text: "Cellulite Reduction", label: "Cellulite Reduction", plKey: "Cellulite Reduction" },
{ key: "Tattoo Removal", text: "Tattoo Removal", label: "Tattoo Removal", plKey: "Tattoo Removal" },
{ key: "Laser Hair Removal", text: "Laser Hair Removal", label: "Laser Hair Removal", plKey: "Laser Hair Removal" },
{ key: "Female Rejuvenation", text: "Female Rejuvenation", label: "Female Rejuvenation", plKey: "Female Rejuvenation" },
{ key: "Breast Augmentation or Lift", text: "Breast Augmentation or Lift", label: "Breast Augmentation or Lift", plKey: "Breast Augmentation or Lift" },
{ key: "Tummy Tuck", text: "Tummy Tuck", label: "Tummy Tuck", plKey: "Tummy Tuck" },
{ key: "Eyelid Surgery", text: "Eyelid Surgery", label: "Eyelid Surgery", plKey: "Eyelid Surgery" },
{ key: "Liposuction", text: "Liposuction", label: "Liposuction", plKey: "Liposuction" },
{ key: "Nose Surgery", text: "Nose Surgery", label: "Nose Surgery", plKey: "Nose Surgery" },
{ key: "Vein Treatment", text: "Vein Treatment", label: "Vein Treatment", plKey: "Vein Treatment" },
{ key: "Facelift", text: "Facelift", label: "Facelift", plKey: "Facelift" },
{ key: "Weight Loss", text: "Weight Loss", label: "Weight Loss", plKey: "Weight Loss" },
{ key: "Hair Restoration", text: "Hair Restoration", label: "Hair Restoration", plKey: "Hair Restoration" }
];


export {
    defaultValues, sortByList, loanPurposeList1, PrimaryProjectPurpose,
    stateList,stateHWList, housingList, employmentList, citizenshipStatusList, highestEducationList, 
    estimatedCreditScoreList, timeAtCurrentAddressList, anyMilitaryServiceList,
    sortByOfferList, sortByOfferList1,  POBox, salaryPeriod, AddCoborrower, SubLoanPurpose
};