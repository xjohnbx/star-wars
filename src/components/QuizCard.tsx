import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Card } from '@rneui/base';
import { Button } from '@rneui/themed';
import { Person, Planet } from '../__generated__/graphql';

type QuizCardProps = {
    personInQuestion?: Person;
    answerOptions: Planet[];
    onNextQuestion: (correctAnswer: boolean) => void;
};

type ButtonStates = {
    answer0: string;
    answer1: string;
    answer2: string;
    answer3: string;
}

const QuizCard: React.FC<QuizCardProps> = ({ answerOptions, personInQuestion, onNextQuestion }: QuizCardProps) => {
    const initialButtonStates: ButtonStates = {
        answer0: 'rgba(0, 123, 255, 0.3)',
        answer1: 'rgba(0, 123, 255, 0.3)',
        answer2: 'rgba(0, 123, 255, 0.3)',
        answer3: 'rgba(0, 123, 255, 0.3)',
    };

    const [buttonStates, setButtonStates] = useState<ButtonStates>(initialButtonStates);
    const [questionAnswered, setQuestionAnswered] = useState<boolean>(false);
    const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean>(false);
    
    useEffect(() => {
        console.log("Correct Answer: " + personInQuestion?.homeworld?.name);
    }, [personInQuestion])

    const answerButtonHandler = (buttonName: keyof ButtonStates, title: string) => {
        const correctAnswer = title === personInQuestion?.homeworld?.name;

        setIsCorrectAnswer(correctAnswer);
        setQuestionAnswered(true);
        setButtonStates((prevButtonStates) => ({
            ...prevButtonStates,
            [buttonName]: correctAnswer ? '#4cd964' : '#ff3b30'
        }));
    };

    const nextQuestionButtonHandler = () => {
        setButtonStates(initialButtonStates);
        setQuestionAnswered(false);
        onNextQuestion(isCorrectAnswer);
    };

    const renderAnswers = () => {
        return (
            <View style={styles.answerContainer}>
                <View style={styles.row}>
                    {/* Answer0*/}
                    <TouchableOpacity style={[styles.answerButton, { borderWidth: 2, borderColor: buttonStates.answer0}]} onPress={() => answerButtonHandler('answer0', answerOptions[0]?.name ?? 'No Answer')} disabled={questionAnswered}>
                        <Text style={styles.answerText} numberOfLines={1} adjustsFontSizeToFit>{answerOptions[0]?.name ?? 'No Answer'}</Text>
                    </TouchableOpacity>
                    {/* Answer1 */}
                    <TouchableOpacity style={[styles.answerButton, { borderWidth: 2, borderColor: buttonStates.answer1 }]} onPress={() => answerButtonHandler('answer1', answerOptions[1]?.name ?? 'No Answer')} disabled={questionAnswered}>
                        <Text style={styles.answerText} numberOfLines={1} adjustsFontSizeToFit>{answerOptions[1]?.name ?? 'No Answer'}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    {/* Answer2 */}
                    <TouchableOpacity style={[styles.answerButton, { borderWidth: 2, borderColor: buttonStates.answer2 }]} onPress={() => answerButtonHandler('answer2', answerOptions[2]?.name ?? 'No Answer')} disabled={questionAnswered}>
                        <Text style={styles.answerText} numberOfLines={1} adjustsFontSizeToFit>{answerOptions[2]?.name ?? 'No Answer'}</Text>
                    </TouchableOpacity>
                    {/* Answer3 */}
                    <TouchableOpacity style={[styles.answerButton, { borderWidth: 2, borderColor: buttonStates.answer3 }]} onPress={() => answerButtonHandler('answer3', answerOptions[3]?.name ?? 'No Answer')} disabled={questionAnswered}>
                        <Text style={styles.answerText} numberOfLines={1} adjustsFontSizeToFit>{answerOptions[3]?.name ?? 'No Answer'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.outerContainer}>
            <Card containerStyle={styles.cardContainer}>
                <View style={{ flex: 1, minWidth: 200, padding: 10, }}>
                <Card.Title style={{ flexShrink: 1, }}>
                    {`What planet is ${personInQuestion?.name ?? 'Yoda'} from?`}
                </Card.Title>
                <Card.Divider />
                {renderAnswers()}
                <Button
                    title="Next Question"
                    disabled={!questionAnswered}
                    buttonStyle={{
                        borderColor: 'rgba(78, 116, 289, 1)',
                    }}
                    type="outline"
                    raised
                    onPress={nextQuestionButtonHandler}
                />
                </View>
            </Card>

        </View>
    );
};

const styles = StyleSheet.create({
    answerButton: {
        minHeight: 50,
        minWidth: 150,
        margin: 8,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    answerContainer: {
        minWidth: 200,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    answerText: {
        fontSize: 15,
        textAlign: 'center',
    },
    cardContainer: {
        minWidth: 300,
        height: '90%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    outerContainer: {
        height: '90%',
        width: '100%',
    },
    row: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    questionText: {
        fontSize: 15,
        textAlign: 'center',
        alignContent: 'center',
    },
});

export default QuizCard;