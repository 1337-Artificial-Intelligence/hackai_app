import React from 'react';
import styled from 'styled-components';

const StyledMainTitle = styled.div`
	z-index : 999;
	width : 100vw;
	left : 0;
	height: 200px;
	position: relative; /* <-- THIS IS WHAT YOU NEED */
	display: flex;
	justify-content: center;
	align-items: center;
	overflow : hidden;
	margin-top : -13%;
	/* margin-bottom : 300px; */
	.Tape{
		background: linear-gradient(
  135deg,
  rgba(232, 0, 234, 0.8),
  rgba(179, 0, 179, 0.8),
  rgba(102, 0, 102, 0.8)
);

		height : 80px;
		width : 120%;
		position : absolute;
		left : -5%;
		transform : rotate(-3deg);
		display : flex;
		align-items : center;
		justify-content : flex-start;
		border : 1px solid rgba(102, 0, 102, 0.4);
		z-index : 2;
		box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
		backdrop-filter: blur( 4px );
		-webkit-backdrop-filter: blur( 4px );

		overflow: hidden;
		white-space: nowrap;
		h1{
			color : white;
			font-size : 1.5rem;
			font-weight : 600;
			opacity : 0.9;
			word-spacing: 5px;
		}
	}
	.Tape2{
		background: linear-gradient(
  135deg,
  rgba(232, 0, 234, 1),
  rgba(179, 0, 179, 1),
  rgba(102, 0, 102, 1)
);

		height : 80px;
		width : 120%;
		position : absolute;
		left : -5%;
		transform : rotate(3deg);
		display : flex;
		align-items : center;
		justify-content : flex-start;
		z-index : 1;
		white-space: nowrap;
		h1{
			opacity : 0.5;
			color : white;
			font-size : 1.5rem;
			font-weight : 600;
			word-spacing: 5px;
		}
	}
`

const MainTitle = () => {
	return <StyledMainTitle>
		<div className='Tape'>
			<h1>What is HackAI Morocco?  -  What is HackAI Morocco?  -  What is HackAI Morocco?  -  What is HackAI Morocco?  -  What is HackAI Morocco?</h1>
		</div>
		<div className='Tape2'>
			<h1>What is HackAI Morocco?  -  What is HackAI Morocco?  -  What is HackAI Morocco?  -  What is HackAI Morocco?  -  What is HackAI Morocco?</h1>
		</div>
	</StyledMainTitle>;
}



const StyledCustomTitle = styled.div`
`
export const CustomTitle = () => {
	return <StyledCustomTitle>
		
	</StyledCustomTitle>
}


export default MainTitle;