import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `https://jservice.io/api`;

export const fetchRandomQuestions = createAsyncThunk(
    "question/fetch",
    async (data, { rejectWithValue }) => {
        try {
            const { count } = data;
            const response = await axios.get(
                `${API_URL}/random?count=${count}`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchQuestionOptions = createAsyncThunk(
    "question/option",
    async (data, { rejectWithValue }) => {
        try {
            const { categoryId, answer } = data;
            const response = await axios.get(
                `${API_URL}/clues?category=${categoryId}`
            );
            return { options: response.data, answer: answer };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * helper function to seperate answer from questions.
 * @param {Array of question objects} questionsData
 * @returns {Array of questions, Array of answers} {questions, answers}
 */
const getOnlyQuestion = (questionsData) => {
    const questions = questionsData?.map((question) => {
        return {
            id: question.id,
            question: question.question,
            categoryId: question.category_id,
        };
    });

    return questions;
};

const isCorrectAnswer = (questionId, answer, allQuestions) => {
    let isCorrect = false;

    for (let question of allQuestions) {
        if (question.id === questionId && question.answer === answer) {
            isCorrect = true;
        }
    }
    return isCorrect;
};

const initialState = {
    allQuestionAnswers: [],
    allQuestions: [],
    questionOptions: [],
    answeredQuestions: [],
    summary: [],
    isLoading: false,
    error: null,
};

const questionSlice = createSlice({
    name: "question",
    initialState,
    reducers: {
        saveAnsweredQuestions: (state, action) => {
            state.answeredQuestions.push({
                ...action.payload,
                options: state.questionOptions,
            });
        },

        getSummary: (state, action) => {
            let summary = state.answeredQuestions.map((question) => {
                return {
                    isCorrect: isCorrectAnswer(
                        question.question.id,
                        question.answer,
                        state.allQuestionAnswers
                    ),
                    options: question.options,
                    timeTaken: question.timer,
                    question: question.question.question,
                    answerd: question.answer,
                    actualAnswer: state.allQuestionAnswers.find(
                        (ques) => ques.id === question.question.id
                    )?.answer,
                };
            });
            state.summary = summary;
            state.answeredQuestions = [];
            // save to localstorage
            let prevSummaries = localStorage.getItem("summary");
            if (prevSummaries) {
                prevSummaries = JSON.parse(prevSummaries);
                localStorage.setItem(
                    "summary",
                    JSON.stringify([...prevSummaries, [...summary]])
                );
            } else {
                localStorage.setItem("summary", JSON.stringify([summary]));
            }
        },

        getAllSummaries: (state, action) => {
            let summary = localStorage.getItem("summary");
            if (summary) {
                summary = JSON.parse(summary);
                state.summary = summary;
            }
        },

        setCurrentSummary: (state, action) => {
            state.summary = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(fetchRandomQuestions.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchRandomQuestions.fulfilled, (state, action) => {
            state.isLoading = false;
            state.allQuestionAnswers = action.payload;
            state.allQuestions = getOnlyQuestion(action.payload);
        });
        builder.addCase(fetchRandomQuestions.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        builder.addCase(fetchQuestionOptions.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchQuestionOptions.fulfilled, (state, action) => {
            state.isLoading = false;
            state.questionOptions = [
                ...action.payload.options
                    ?.slice(0, 3)
                    .map((option) => option.answer),
                action.payload.answer,
            ];
        });
        builder.addCase(fetchQuestionOptions.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });
    },
});

export const {
    saveAnsweredQuestions,
    getSummary,
    getAllSummaries,
    setCurrentSummary,
} = questionSlice.actions;

export default questionSlice.reducer;
