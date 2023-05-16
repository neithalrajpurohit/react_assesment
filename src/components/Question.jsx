import React from "react";

const Question = ({ id, question, answer, questionNo }) => {
    return (
        <ul className="mb-2 max-w-[600px]">
            <li className="text-[18px] ">
                <span className="font-semibold">Q.{questionNo}</span> {question}
            </li>
            <span className="ml-1 answers">
                <span className="font-semibold">Answer:</span> {answer}
            </span>
        </ul>
    );
};

export default Question;
