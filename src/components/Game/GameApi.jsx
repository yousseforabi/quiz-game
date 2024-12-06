// src/components/Game/GameAPI.js
import axios from 'axios';
import he from "he"
import { data } from 'react-router-dom';



  
 export const fetchApiData = (apiToken,setQuizData) => {
  
  
    
    axios.get(`https://opentdb.com/api.php?amount=10&token=${apiToken}&type=multiple`).then((res) => {
      
     
      console.log(res.data)
      const dataResponse = res.data.results;

      setQuizData((prevState) => [
        ...prevState,
       ...dataResponse.map((item) => {
        const deCodedCorrectAnswer = he.decode(item.correct_answer);
        const decodedIncorrectAnswers = item.incorrect_answers.map((answer) => he.decode(answer))
        const shuffledAnswers = shuffleArray([deCodedCorrectAnswer,...decodedIncorrectAnswers])
        
        return {
          correctAnswer:deCodedCorrectAnswer,
          answers:shuffledAnswers,
          question:he.decode(item.question)
        }
       })
      ])
   
     })
  }

 export const fetchApiToken = (setApiToken) => {
    axios.get("https://opentdb.com/api_token.php?command=request").then((res) => {
        setApiToken(res.data.token)
        console.log(res.data.token)
    })
  }


export const shuffleArray = (array) => {
    for(let i = array.length -1; i > 0; i--){

      const randomIndex = Math.floor(Math.random() * (i + 1));

      [array[i], array[randomIndex]] = [array[randomIndex], array[i]];

    }
    return array;
  }

  
