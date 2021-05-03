import React from 'react';
import { TICKET_ISSUE_TYPE } from '../../typing/DataType';

const url: Record<TICKET_ISSUE_TYPE, string> = {
  task:
    'https://aftership.atlassian.net/secure/viewavatar?avatarId=10318&avatarType=issuetype',
  subtask:
    'https://aftership.atlassian.net/secure/viewavatar?avatarId=10316&avatarType=issuetype',
  story: 'https://aftership.atlassian.net/images/icons/issuetypes/story.svg',
  goal: 'https://aftership.atlassian.net/images/icons/issuetypes/epic.svg',
  bug:
    'https://aftership.atlassian.net/secure/viewavatar?size=medium&avatarId=10303&avatarType=issuetype',
};

export const IssueIcon = ({ type }: { type: TICKET_ISSUE_TYPE }) => {
  return <img width="100%" height="100%" src={url[type]} alt={type} />;
};
