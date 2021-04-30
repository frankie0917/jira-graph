export type TICKET_STATUS = 'open' | 'closed' | 'in_progress';

export type TICKET_ISSUE_TYPE = 'story' | 'task' | 'subtask' | 'bug' | 'goal';

export type DataType = {
  key: string;
  title: string;
  status: TICKET_STATUS;
  children: string[];
  blocked_by: string[];
  assignees: string[];
  issue_type: TICKET_ISSUE_TYPE;
};
