import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchQuestionOptions,
    fetchRandomQuestions,
    saveAnsweredQuestions,
} from "../features/question/questionSlice";
import Question from "./Question";
import Summary from "./Summary";

const Home = () => {
    const dispatch = useDispatch();
    const questions = useSelector((state) => state.question);
    const [showQuiz, setShowQuiz] = useState(true);
    const [isQuizStarted, setIsQuizStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState({
        quiz: null,
        index: 0,
    });
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        dispatch(fetchRandomQuestions({ count: 5 }));
    }, []);

    useEffect(() => {
        if (questions.allQuestionAnswers.length >= 1) {
            setTimeout(() => {
                setShowQuiz(false);
                // set initial question to display
                setCurrentQuestion({
                    quiz: questions.allQuestionAnswers[0],
                    index: 0,
                });
                dispatch(
                    fetchQuestionOptions({
                        categoryId: questions.allQuestionAnswers[0].category_id,
                        answer: questions.allQuestionAnswers[0].answer,
                    })
                );
                setIsQuizStarted(true);
            }, 5000);
        }
    }, [questions.allQuestionAnswers]);

    useEffect(() => {
        if (currentQuestion.index >= 1) {
            if (currentQuestion.index < 5) {
                dispatch(
                    fetchQuestionOptions({
                        categoryId:
                            questions.allQuestionAnswers[currentQuestion.index]
                                .category_id,
                        answer: questions.allQuestionAnswers[
                            currentQuestion.index
                        ].answer,
                    })
                );
            }
        }
    }, [currentQuestion.index]);

    useEffect(() => {
        let interval;
        if (isQuizStarted) {
            clearInterval(interval);
            interval = undefined;
            setSeconds(0);
            interval = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds + 1);
            }, 1000);
        }

        if (currentQuestion.index === 5) {
            clearInterval(interval);
            interval = undefined;
            setSeconds(0);
        }

        return () => clearInterval(interval);
    }, [currentQuestion.index, isQuizStarted]);

    // for time up tracking
    useEffect(() => {
        if (seconds >= 15) {
            alert("Time Up");
            dispatch(
                saveAnsweredQuestions({
                    question: questions.allQuestions[currentQuestion.index],
                    answer: "Not answered",
                    timer: seconds,
                })
            );

            if (currentQuestion.index < 5) {
                setCurrentQuestion({
                    quiz: questions.allQuestions[currentQuestion.index + 1],
                    index: currentQuestion.index + 1,
                });
            }
        }
    }, [seconds]);

    const handleOnSubmit = (question, answer) => {
        dispatch(saveAnsweredQuestions({ question, answer, timer: seconds }));
        if (currentQuestion.index < 5) {
            setCurrentQuestion({
                quiz: questions.allQuestions[currentQuestion.index + 1],
                index: currentQuestion.index + 1,
            });
        }
    };

    return (
        <div className=" mt-10">
            {showQuiz ? (
                <div className="flex items-center justify-center w-full h-full">
                    {questions.isLoading ? (
                        <div>Loading...</div>
                    ) : (
                        <div className="p-10 ">
                            {questions.allQuestionAnswers.map((question, i) => {
                                return (
                                    <Question
                                        {...question}
                                        questionNo={i + 1}
                                        key={question.id}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            ) : (
                <div className="max-w-[600px] mx-auto mt-20">
                    {currentQuestion.index < 5 ? (
                        <div className="">
                            <h4 className="text-2xl text-center mb-10">
                                Guess Answer {seconds}s /(Time Limit 15 sec)
                            </h4>
                            <h4 className="font-semibold text-[25px] capitalize">
                                Q.{currentQuestion.index + 1}{" "}
                                {
                                    questions.allQuestions[
                                        currentQuestion.index
                                    ]?.question
                                }
                            </h4>
                            <div className="mt-4 h-[100px]">
                                {questions.isLoading ? (
                                    <div>Loading Options</div>
                                ) : (
                                    <>
                                        {questions.questionOptions?.map(
                                            (option, i) => {
                                                return (
                                                    <div
                                                        className="ml-4 text-[18px]  capitalize"
                                                        key={i}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="option"
                                                            id={`option-${i}`}
                                                            className="inline-block "
                                                            data-answer={option}
                                                            onChange={(e) => {
                                                                setSelectedAnswer(
                                                                    e.target.getAttribute(
                                                                        "data-answer"
                                                                    )
                                                                );
                                                            }}
                                                        />
                                                        <label
                                                            htmlFor={`option-${i}`}
                                                            className="inline-block ml-2"
                                                        >
                                                            {option}
                                                        </label>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="mt-[28px]">
                                {currentQuestion.index < 5 ? (
                                    <button
                                        disabled={questions.isLoading}
                                        onClick={() =>
                                            handleOnSubmit(
                                                currentQuestion.quiz,
                                                selectedAnswer
                                            )
                                        }
                                        className="border-none bg-orange-400 p-2 rounded disabled:opacity-50"
                                    >
                                        Submit
                                    </button>
                                ) : (
                                    <button className="border-none bg-orange-400 p-2 rounded">
                                        Show Summary
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <Summary questions={questions} />
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;
