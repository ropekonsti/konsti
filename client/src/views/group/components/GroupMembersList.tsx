import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { GroupMember } from 'shared/typings/api/groups';

export interface Props {
  groupMembers: readonly GroupMember[];
}

export const GroupMembersList = ({ groupMembers }: Props): ReactElement => {
  const { t } = useTranslation();

  if (!groupMembers) return <GroupMembersListContainer />;

  const membersList = groupMembers.map((member, index) => {
    const leader = member.serial === member.groupCode;
    return (
      <p key={member.username}>
        {index + 1}) {member.username}{' '}
        {leader && <span>({t('groupLeader')})</span>}
      </p>
    );
  });

  return <GroupMembersListContainer>{membersList}</GroupMembersListContainer>;
};

const GroupMembersListContainer = styled.div`
  margin: 0 0 0 14px;
`;
