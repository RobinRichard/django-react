import React, {useState} from 'react'

const QUESTION_LIST =[
    {
        id:"Q1",
        text:"What is your weight",
        type:"input"
    },
    {
        id:"Q2",
        text:"What is your height",
        type:"input"
    }
]

export const Questions = () => {

    const [state, setState] = useState({})

    const handleChange = (e)=>{
        const _state = {...state}
        _state[e.target.name] = e.target.value
        setState(_state)
    }

    const questions = QUESTION_LIST.map(({id,text,type})=>{
        if(type==="input"){
            return (
                <div class="mb-3">
                   <label for={id} class="form-label">{text}</label>
                    <input type="text" class="form-control" id={id} onChange={handleChange} name={id} value={state.hasOwnProperty(id)?state[id]:null} />
                </div>)
            }
        return null;
    })
    return (
        <div className={"container"}>
            <h3>Question</h3>
            {questions}
        </div>
    )
}
