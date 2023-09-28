import React from 'react';
import styled from 'styled-components';
import { Button, Collapse } from 'antd';


export type UncacheLink = React.AnchorHTMLAttributes<HTMLAnchorElement>;
export const UncacheLink = ({
    href,
    children,
    ...rest
}: UncacheLink) => {
    return <a href={href} {...rest}>{children}</a>;
};

export const UndesiredPageContainer = styled.div`
    /* width: 100%; */
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #4a4b57;
    margin-top: 42px;
    padding:  calc(80px * 1);
    row-gap: 1px;
    background-color: #fafafc;

    .error-status-code {
        vertical-align: baseline;
        font-size: 110px;
        font-weight: bold;
        line-height: 1;
    }

    .error-name {
        flex: 0;
        text-align: center;
        .anticon {
            margin-right: 30px;
            vertical-align: baseline;
            font-size: 96px;
        }
        .message {
            font-size: 56px;
            line-height: 96px;
            font-weight: bold;
            text-transform: uppercase;
            display: inline-block;
            vertical-align: bottom;
        }
    }
`;

// [CONTENT]
const UndesiredContentContainer = styled.div`
    margin-top: 1px;
    font-size: 35px;
    text-align: center;
    /* flex: 1; */
    .error-description {
        margin-bottom: 30px;
    }
    .error-sub-description {
        margin-top: 1px;
        font-size: 21px;
    }
    .back-button {
        min-width: 12rem;
        height: unset;
        font-size: 22px;
        border-radius: 99999px;
    }
`;

export type UndesiredContent = {
    description: React.ReactNode,
    subDescription?: React.ReactNode,
    onBack?: () => void,
    onBackLabel?: React.ReactNode,
}
export const UndesiredContent = ({
    description,
    subDescription,
    onBack = () => {
        window.history.back();
    },
    onBackLabel = 'Back',
}: UndesiredContent) => {
    return <UndesiredContentContainer className="error-content">
        <div className="error-description">
            {description}
            <div className="error-sub-description">{subDescription}</div>
        </div>
        {onBackLabel && <Button type="primary" className="back-button" onClick={onBack}>{onBackLabel}</Button>}
    </UndesiredContentContainer>;
};

// [FOOTER]
const UndesiredFooterContainer = styled.div`
    flex: 1;
    font-size: 22px;
    color: #787885;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    .output {
        flex: 1;
    }

    .error-output-collapse {
        border: 0;
        .error-output-collapse-panel {
            border-bottom: 0;
        }
        .ant-collapse-header,
        .show-error-btn {
            font-size: 22px;
        }
        .show-error-btn, 
        .ant-collapse-content-box {
            padding: 0;
        }
        .ant-collapse-content-box span,
        .ant-collapse-content {
            border: 0;
            
        }
    }
    
    .link-section {
        display: flex;
        flex-direction: column;
    }

    p {
        margin-bottom: 1px;
        text-align: center;
    }
    .list-link {
        text-align: center;
        color: #9696a0;
        margin-bottom: 1px;
    }
    .contact-link {
        text-align: center;
    }

    a {
        color: #1890ff;
        cursor: pointer;
        text-decoration: none;
        background-color: transparent;
        outline: none;
        transition: color .3s;
    }
`;

const UndesiredOutput = styled.span`
    background-color: white;
    border-radius: 0.5rem;
    border: 1px solid #e1e1e3;
    display: inline-block;
    line-height: 1.25;
    padding: 5px;
    white-space: pre-wrap;
    font-family: monospace;
    font-size: 16px;
    min-width: 250px;
    max-width: 50vw;
    word-break: break-word;
`;
export type UndesiredNavigator = {
    output?: string,
    showOutput?: boolean,
    showButton?: boolean,
}
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const UndesiredNavigator = ({
    output,
    showOutput = true,
    showButton = true,
}: UndesiredNavigator) => {
    // const [outputVisible, setOuputVisible] = React.useState<'' | '1'>('');

    return <UndesiredFooterContainer className="error-footer">
        {showOutput && <p className="output">
            <Collapse className='error-output-collapse'>
                <Collapse.Panel
                    className='error-output-collapse-panel'
                    showArrow={false}
                    header={
                        <span>
                            <Button type='link' className='show-error-btn'>
                                Click here
                            </Button>&nbsp;to view the error details:
                        </span>
                    }
                    key="1"
                >
                    <UndesiredOutput>
                        {output}
                    </UndesiredOutput>
                </Collapse.Panel>

            </Collapse>
        </p>}
        {showButton && <>
            <div className="link-section">
                <p className="instruction">Here are some helpful links instead:</p>
                <div className="list-link">
                    <UncacheLink href={'/Home' ?? ''}>Landing Page</UncacheLink>
                    {' | '}
                    <UncacheLink href={'/Home'} >Application Homepage</UncacheLink>
                </div>
                <div className="contact-link">
                    Technical Contact:&nbsp;
                    <span>thanhan7112@gmail.com</span>
                </div>
            </div>
        </>}
    </UndesiredFooterContainer>;
};