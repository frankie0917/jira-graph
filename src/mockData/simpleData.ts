import { DataType } from '../typing/DataType';

export const data: DataType[] = [
  {
    assignees: ['gy.huang@aftership.com'],
    blocked_by: [],
    key: 'RTC-001',
    children: ['RTC-002', 'RTC-004'],
    status: 'in_progress',
    title: 'Parent story',
    issue_type: 'story',
  },
  {
    assignees: ['gy.huang@aftership.com'],
    blocked_by: ['RTC-003'],
    key: 'RTC-002',
    children: [],
    status: 'in_progress',
    title: 'Child task',
    issue_type: 'task',
  },
  {
    assignees: ['gy.huang@aftership.com'],
    blocked_by: [],
    key: 'RTC-003',
    children: [],
    status: 'in_progress',
    title: 'Child task',
    issue_type: 'subtask',
  },
  {
    assignees: ['gy.huang@aftership.com'],
    blocked_by: [],
    key: 'RTC-004',
    children: [],
    status: 'in_progress',
    title: 'Child task',
    issue_type: 'subtask',
  },
  {
    assignees: ['gy.huang@aftership.com'],
    blocked_by: [],
    key: 'RTC-003',
    children: [],
    status: 'in_progress',
    title: 'Child task',
    issue_type: 'subtask',
  },
];
