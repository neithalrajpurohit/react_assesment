import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSummary } from "../features/question/questionSlice";

const Summary = (props) => {
    const questionData = useSelector((state) => state.question);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSummary());
    }, []);

    // calculation fo no of correct answers
    let correctAnsers = questionData?.summary?.reduce((prev, curr) => {
        if (curr?.isCorrect) {
            prev++;
        }
        return prev;
    }, 0);

    return (
        <div>
            <h5 className="text-4xl">Summary</h5>
            <h5 className="text-[28px]">
                Correct:{" "}
                <span className="font-semibold">
                    {correctAnsers}
                    /5
                </span>
            </h5>
            {questionData.summary?.map((summary, i) => {
                return (
                    <div
                        key={i}
                        className={`mb-5 p-4 rounded ${
                            summary.actualAnswer === summary.answerd
                                ? "bg-green-200"
                                : "bg-red-200"
                        }`}
                    >
                        <div className="flex ">
                            <h4 className="capitalize">
                                Q.{i + 1} {summary.question}
                            </h4>
                            <p className="ml-5 font-semibold ">
                                ( Time Taken: {summary.timeTaken}s)
                            </p>
                        </div>
                        {summary?.options?.map((option, i) => {
                            return (
                                <p
                                    key={i}
                                    className={`${
                                        option === summary.actualAnswer
                                            ? "font-semibold"
                                            : option === summary.answerd
                                            ? "font-bold"
                                            : "font-normal"
                                    }`}
                                >
                                    {i + 1}. {option}
                                </p>
                            );
                        })}
                        {!summary.isCorrect ? (
                            <div className="mt-4">
                                <p className="font-bold">
                                    Actual Answer: {summary.actualAnswer}
                                </p>
                                <p className="font-semibold">
                                    You Answered: {summary.answerd}
                                </p>
                            </div>
                        ) : (
                            <p>Answer: {summary.actualAnswer}</p>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default Summary;
