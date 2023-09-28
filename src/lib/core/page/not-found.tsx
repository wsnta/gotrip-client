import React from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { UndesiredNavigator, UndesiredPageContainer, UndesiredContent } from './styled';
import styled from 'styled-components';

const UndesiredInternalErrorContainer = styled(UndesiredPageContainer)`
    .anticon-question-circle {
        color: var(--main-major);
    }
`;

export function PageError404() {
    return (
        <UndesiredInternalErrorContainer className="internal-error-page">
            <div className="error-status-code">404</div>
            <div className="error-name">
                <QuestionCircleOutlined />
                <span className="message">Page not found</span>
            </div>
            <UndesiredContent description={<>
                <span>The page you are looking for doesn’t exist or an other error occurred.</span>
                <br />
                <span>Please refreshing the page or click the button below to go back the Homepage.</span>
            </>} />
            <UndesiredNavigator showOutput={false} />
        </UndesiredInternalErrorContainer>
    );
}
