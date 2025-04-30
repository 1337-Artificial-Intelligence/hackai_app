import React from 'react';
import styled from 'styled-components';


const StyledNeoon = styled.div`
  height : 100vh;
  width : 100vw;
  position : absolute;
  overflow : hidden;
  display : flex;
  justify-content : center;
  align-items : center;

  .Light{

	position : absolute;
  width: 1600px;
  height: 400px;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(232, 0, 234, 0.4),
    rgba(179, 0, 179, 0.2),
    rgba(0, 0, 0, 0.6)
  );
  filter: blur(100px);

}

`

const StyledNeon = () => {
	return <StyledNeoon>
    <div className='Light'>

    </div>
  </StyledNeoon>;
}


export default StyledNeon;