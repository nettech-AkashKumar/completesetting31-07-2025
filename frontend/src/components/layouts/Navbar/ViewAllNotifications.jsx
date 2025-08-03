import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import axios from 'axios';
import BASE_URL from '../../../pages/config/config';
import { toast } from 'react-toastify';
import { 
  FaBell, 
  FaCheck, 
  FaCheckDouble, 
  FaUser,
  FaClock,
  FaEnvelope,
  FaReply,
  FaAt
} from 'react-icons/fa';
import { MdMessage } from 'react-icons/md';
import { CiClock2 } from 'react-icons/ci';

const ViewAllNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch notifications for the current user
  const fetchNotifications = async (page = 1) => {
    if (!user?._id) return;

    try {
      setLoading(true);
      const token = getToken();
      const response = await axios.get(
        `${BASE_URL}/api/notifications/${user._id}?page=${page}&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setNotifications(response.data.notifications);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    if (!user?._id) return;

    try {
      const token = getToken();
      const response = await axios.get(
        `${BASE_URL}/api/notifications/unread/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const token = getToken();
      await axios.put(
        `${BASE_URL}/api/notifications/read/${notificationId}`,
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );

      // Update unread count
      fetchUnreadCount();
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const token = getToken();
      await axios.put(
        `${BASE_URL}/api/notifications/read-all/${user._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );

      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };



  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  // Load notifications on component mount
  useEffect(() => {
    if (user?._id) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [user?._id]);

  if (!user) {
    return (
      <div style={{padding:'10px 20px'}}>
        <div>
          <span style={{fontSize:'22px',fontWeight:'700'}}>All Notifications</span>
          <br/>
          <span style={{fontSize:'19px',fontWeight:'400',color:'#86888bff'}}>Please log in to view notifications</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{padding:'10px 20px'}}>
      {/* header */}
      <div>
        <span style={{fontSize:'22px',fontWeight:'700'}}>All Notifications</span>
        <br/>
        <span style={{fontSize:'19px',fontWeight:'400',color:'#86888bff'}}>View your all activities</span>
      </div>

      {/* all messages */}
      <div style={{marginTop:'15px'}}>
        {loading ? (
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',padding:'40px'}}>
            <div style={{textAlign:'center'}}>
              <div style={{width:'40px',height:'40px',border:'4px solid #f3f3f3',borderTop:'4px solid #667eea',borderRadius:'50%',animation:'spin 1s linear infinite',margin:'0 auto 16px'}}></div>
              <p style={{color:'#6c757d'}}>Loading notifications...</p>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'60px 20px',textAlign:'center',color:'#6c757d'}}>
            <FaBell style={{fontSize:'48px',color:'#dee2e6',marginBottom:'16px'}} />
            <h3 style={{margin:'0 0 8px 0',fontSize:'20px',fontWeight:'600',color:'#495057'}}>No notifications</h3>
            <p style={{margin:0,fontSize:'14px',color:'#6c757d'}}>You're all caught up! No new notifications.</p>
          </div>
        ) : (
          <>
            {notifications.map((notification) => (
              <div 
                key={notification._id} 
                style={{
                  display:'flex',
                  padding:'10px 20px',
                  gap:'10px',
                  border:'1px solid #94979eff',
                  borderRadius:'5px',
                  backgroundColor: notification.read ? 'white' : '#f0f8ff',
                  marginBottom:'15px',
                  position:'relative',
                  borderLeft: notification.read ? '1px solid #94979eff' : '4px solid #667eea'
                }}
              >
                <div>
                  {notification.sender?.profileImage ? (
                    <img 
                      src={notification.sender.profileImage} 
                      alt="Sender" 
                      style={{width:'50px',borderRadius:'50%',objectFit:'cover'}}
                    />
                  ) : (
                    <div style={{
                      width:'50px',
                      height:'50px',
                      borderRadius:'50%',
                      backgroundColor:'#e9ecef',
                      display:'flex',
                      alignItems:'center',
                      justifyContent:'center',
                      color:'#6c757d',
                      fontSize:'20px'
                    }}>
                      <FaUser />
                    </div>
                  )}
                </div>
                <div style={{flex:1}}>
                  <span style={{fontWeight:'500'}}>
                    {notification.sender?.firstName} {notification.sender?.lastName}: 
                  </span>
                  <span style={{fontWeight:'400',color:'#86888bff'}}> {notification.message}</span>
                  <br/>
                  <div style={{display:'flex',alignItems:'center',gap:'4px',marginTop:'4px'}}>
                    <CiClock2 style={{fontSize:'12px'}} />
                    <span style={{fontSize:'12px',fontWeight:'400'}}>
                      {formatTimestamp(notification.timestamp)}
                    </span>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div style={{display:'flex',gap:'8px',alignItems:'flex-start'}}>
                  {!notification.read && (
                    <button
                      style={{
                        width:'24px',
                        height:'24px',
                        border:'none',
                        borderRadius:'4px',
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'center',
                        cursor:'pointer',
                        background:'#28a745',
                        color:'white',
                        fontSize:'10px'
                      }}
                      onClick={() => markAsRead(notification._id)}
                      title="Mark as read"
                    >
                      <FaCheck />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                gap:'16px',
                padding:'20px 0',
                borderTop:'1px solid #f1f3f4',
                marginTop:'20px'
              }}>
                <button
                  style={{
                    background: currentPage === 1 ? '#6c757d' : '#667eea',
                    color:'white',
                    border:'none',
                    padding:'8px 16px',
                    borderRadius:'6px',
                    fontSize:'14px',
                    fontWeight:'500',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    opacity: currentPage === 1 ? 0.6 : 1
                  }}
                  disabled={currentPage === 1}
                  onClick={() => fetchNotifications(currentPage - 1)}
                >
                  Previous
                </button>
                
                <span style={{fontSize:'14px',color:'#6c757d',fontWeight:'500'}}>
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  style={{
                    background: currentPage === totalPages ? '#6c757d' : '#667eea',
                    color:'white',
                    border:'none',
                    padding:'8px 16px',
                    borderRadius:'6px',
                    fontSize:'14px',
                    fontWeight:'500',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    opacity: currentPage === totalPages ? 0.6 : 1
                  }}
                  disabled={currentPage === totalPages}
                  onClick={() => fetchNotifications(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewAllNotifications;