import React from "react";
import ReactDOM from "react-dom/client";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import ClassAsgmts from "./components/ClassAssignments/classAsgmts";
import TestAsgmtPage from "./components/ClassAssignments/testAsgmtPage";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          //I added this route so I could easily see what the page looks like by visiting 'http://localhost:3000/class-asgmts'
          path="/class-asgmts"
          element={
            //This is just a test class to see how the class assignments page will look.
            //I'm not sure how you would actually link to a specific class like this from teacher's main page and provide both
            //the class name and assignments list.
            //Maybe only the class name should be passed via a searchParam (like I did below for the test assignment pages) and
            //then query the backend for the actual assignments? Not sure
            <ClassAsgmts
            className={"Spanish 100"}
            asgmts={[
              { name: "Lesson 1: Talking in Class", termCount: 20 },
              { name: "Lesson 2: Greetings and Introductions", termCount: 15 },
              { name: "Lesson 3: Numbers and Colors", termCount: 17 },
              { name: "Lesson 4: Family and Relationships", termCount: 25 },
              { name: "Lesson 5: Daily Routines", termCount: 21 },
              { name: "Lesson 6: Describing People and Places", termCount: 10 },
              { name: "Lesson 7: Food and Dining", termCount: 12 },
            ]}
          />
          }
        />
        {/* I just added these routes so I could test that my assignment buttons actually go somewhere and pass the assignment 
        name via search param */}
        <Route path="/asgmtPage/:name" element={<TestAsgmtPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
