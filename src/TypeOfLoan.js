import React from "react";

// function generatedLenderDisclaimers(lenderDisclaimers, settings) {
//       console.log(lenderDisclaimers);
//       const disclaimerHtmls = [];
//       debugger;
//       settings.lenderInfo.forEach((lender, index) => {
//             if(lender.lender === 'Prosper' &&  lender.disclaimer) {
//                   disclaimerHtmls.push(
//                         <div className="col-md-12" key={lender.lender} >
//                               <hr className="hr-size" />
//                               <p>Disclosures from {lender.lender}: {lender.disclaimer}</p>
//                         </div>
//                   );
//             }
//       });
//       return disclaimerHtmls;
// }

function TypeOfLoan(props) {
      
      return (
            <div className="type-of-loan">
                  <div className="row">
                        <div className="col-md-12" >
                              <p>Some of our partners were unable to pre-qualify you for a loan. This may mean that they do not operate in your area or that your credit report profile wasn't sufficient to qualify. You may receive an "Adverse Action Notice" from some of our partners explaining why. However, rest assured that your credit was not impacted. Lenders just send these to explain why you weren't pre-qualified. You may wish to request a copy of your credit report and review for inaccuracies.
                              </p>
                              <p>*In addition to the interest charged on your loan, some lenders may also add origination or other fees. The interest and fees cost displayed is an estimate based on available information, and may not reflect the actual full cost of your loan. Please review in full the disclosures provided by your lender of choice before accepting your loan.</p>
                        </div>
                        {/* {generatedLenderDisclaimers(props.disclaimers, props.settings)} */}
                  </div>
            </div>
      );
}

export default TypeOfLoan;