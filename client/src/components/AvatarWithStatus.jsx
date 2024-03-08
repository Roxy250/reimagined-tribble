import React from 'react';
import Badge from '@mui/joy/Badge';
import Avatar from '@mui/joy/Avatar';

const AvatarWithStatus = (props) => {
  const { online = false, ...other } = props;
  return (
    <div>
      <Badge
        color={online ? 'success' : 'neutral'}
        variant={online ? 'solid' : 'soft'}
        size="sm"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeInset="4px 4px"
      >
        <Avatar size="sm" {...other} />
      </Badge>
    </div>
  );
};

export default AvatarWithStatus;
