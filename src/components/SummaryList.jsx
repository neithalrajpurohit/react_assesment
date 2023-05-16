import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getAllSummaries,
    setCurrentSummary,
} from "../features/question/questionSlice";
import Summary from "./Summary";

const SummaryList = () => {
    const dispatch = useDispatch();
    const questionData = useSelector((state) => state.question);
    const [showSummary, setShowSummary] = useState(null);

    useEffect(() => {
        dispatch(getAllSummaries());
    }, []);

    let correctAnsers = showSummary?.reduce((prev, curr) => {
        if (curr?.isCorrect) {
            prev++;
        }
        return prev;
    }, 0);

    return (
        <div className="px-[100px] mt-5">
            <h4 className="text-4xl">All Summaries</h4>

            <div className="flex gap-20">
                <div className="mt-10 flex-[.2]">
                    {questionData.summary?.map((summary, i) => {
                        return (
                            <div
                                key={i}
                                className="w-[200px] mb-2 cursor-pointer"
                                onClick={() => {
                                    console.log(summary);
                                    setShowSummary(summary);
                                }}
                            >
                                <h4 className="bg-[#dddddd] p-2 rounded">
                                    Summary {i + 1}
                                </h4>
                            </div>
                        );
                    })}
                </div>
                <div>
                    {showSummary && (
                        <div>
                            <h5 className="text-4xl">Summary</h5>
                            <h5 className="text-[28px] mb-5">
                                Correct:{" "}
                                <span className="font-semibold">
                                    {correctAnsers}
                                    /5
                                </span>
                            </h5>
                            {showSummary?.map((summary, i) => {
                                return (
                                    <div
                                        key={i}
                                        className={`mb-5 p-4 rounded ${
                                            summary.actualAnswer ===
                                            summary.answerd
                                                ? "bg-green-200"
                                                : "bg-red-200"
                                        }`}
                                    >
                                        <div className="flex ">
                                            <h4 className="capitalize">
                                                Q.{i + 1} {summary.question}
                                            </h4>
                                            <p className="ml-5 font-semibold ">
                                                ( Time Taken:{" "}
                                                {summary.timeTaken}s)
                                            </p>
                                        </div>
                                        {summary?.options?.map((option, i) => {
                                            return (
                                                <p
                                                    key={i}
                                                    className={`${
                                                        option ===
                                                        summary.actualAnswer
                                                            ? "font-semibold"
                                                            : option ===
                                                              summary.answerd
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
                                                    Actual Answer:{" "}
                                                    {summary.actualAnswer}
                                                </p>
                                                <p className="font-semibold">
                                                    You Answered:{" "}
                                                    {summary.answerd}
                                                </p>
                                            </div>
                                        ) : (
                                            <p>
                                                Answer: {summary.actualAnswer}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SummaryList;
