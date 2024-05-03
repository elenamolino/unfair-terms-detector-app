import React, { useState } from 'react';

import { Tooltip } from 'react-tooltip'

import 'react-tooltip/dist/react-tooltip.css'
import 'bootstrap/dist/css/bootstrap.min.css';

function UnfairTermsPage() {
  // const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
  const items = [];

  const [inputText, setInputText] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Handle the form submission logic here
    console.log('Form submitted with value:', inputText);

    // Clear the input value after submission
    setInputText('');
  };

  const handleChange = (event) => {
    setInputText(event.target.value);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col">
          <h1 className="text-center mb-4">Unfair Terms Detector</h1>
          <div className="input-group">
            <textarea
              className="form-control"
              rows="2"
              value={inputText}
              onChange={handleChange}
              placeholder="Enter terms of service here..."
              style={{ resize: 'none', marginBottom: 0 }}
            />
            <button className="btn btn-primary" type="button" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col">
        {items.length === 0 ? (
          <p className='alert alert-primary'>Nothing to display yet. Submit your unfair terms now!</p>
        ) : (
          <ul className="list-group list-group-flush">
            {items.map((item, index) => (
            <div class="card mb-3">
              <div class="card-body">
                <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
              </div>
                <div class="card-footer text-muted">
                  <span id="t1-a" className="me-2 badge text-bg-primary rounded-pill" style={{opacity: 1.0}}>Arbitration</span>
                  <Tooltip anchorSelect="#t1-a" className='text-bg-dark small p-2 rounded-pill' place="top">75%</Tooltip>
                  <span id="t1-j" className="me-2 badge text-bg-primary rounded-pill" style={{opacity: 0.1}}>Jurisdiction</span>
                  <Tooltip anchorSelect="#t1-j" className='text-bg-dark small p-2 rounded-pill' place="top">75%</Tooltip>
                  <span id="t1-law" className="me-2 badge text-bg-primary rounded-pill" style={{opacity: 0.1}}>Choice of Law</span>
                  <Tooltip anchorSelect="#t1-law" className='text-bg-dark small p-2 rounded-pill' place="top">75%</Tooltip>
                  <span id="t1-ltd" className="me-2 badge text-bg-primary rounded-pill" style={{opacity: 1.0}}>Limitation of Liability</span>
                  <Tooltip anchorSelect="#t1-ltd" className='text-bg-dark small p-2 rounded-pill' place="top">75%</Tooltip>
                  <span id="t1-ch" className="me-2 badge text-bg-primary rounded-pill" style={{opacity: 0.1}}>Unilateral Change</span>
                  <Tooltip anchorSelect="#t1-ch" className='text-bg-dark small p-2 rounded-pill' place="top">75%</Tooltip>
                  <span id="t1-use" className="me-2 badge text-bg-primary rounded-pill" style={{opacity: 0.1}}>Contract by Using</span>
                  <Tooltip anchorSelect="#t1-use" className='text-bg-dark small p-2 rounded-pill' place="top">75%</Tooltip>
                  <span id="t1-ter" className="me-2 badge text-bg-primary rounded-pill" style={{opacity: 0.1}}>Unilateral Terminatio</span>
                  <Tooltip anchorSelect="#t1-ter" className='text-bg-dark small p-2 rounded-pill' place="top">75%</Tooltip>
                  <span id="t1-cr" className="me-2 badge text-bg-primary rounded-pill" style={{opacity: 0.1}}>Content Removal</span>
                  <Tooltip anchorSelect="#t1-cr" className='text-bg-dark small p-2 rounded-pill' place="top">75%</Tooltip>
                </div>
              </div>
            ))}
          </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default UnfairTermsPage;
