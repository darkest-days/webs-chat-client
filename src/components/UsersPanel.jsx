import React from 'react';

const SingleUser = (props) => {
    return (
        <div className='single-user-item'>
            <div className='color-avatar' style={{ background: props.color}} ></div>
            <div className='user-name'>
                {props.user}
            </div>
        </div >
    )
}

export const UsersList = (props) => {

    const usersList = props.usersList;
    const users = usersList.map((user) => {
        if (user.id === -1) {
            return null;
        }
        else {        
            return (
                <SingleUser key={user.id} color={user.color} user={user.userName} />
            );
        }
    });

    return (
        <div id='users-list'>
            {users}
        </div>
    );
}