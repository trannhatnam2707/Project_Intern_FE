import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Card, Avatar, Spin, Tooltip } from 'antd';
import { 
  MessageOutlined, 
  CloseOutlined, 
  RobotOutlined, 
  SendOutlined, 
  UserOutlined,
  MinusOutlined
} from '@ant-design/icons';
import api from '../../services/axios'; // Đảm bảo đường dẫn đúng tới file axios config của bạn

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: 'Xin chào! 👋 Tôi là trợ lý ảo WeHappi. Bạn đang tìm điện thoại, laptop hay cần tư vấn gì không?' 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Ref để tự động cuộn xuống cuối khi có tin nhắn mới
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Xử lý gửi tin nhắn
  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    
    // 1. Hiển thị tin nhắn user
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await api.post('/api/chat/', { message: userMessage });
      
      // 👇 SỬA ĐOẠN NÀY (Xử lý an toàn cho axios)
      // Kiểm tra xem res.data có tồn tại không, nếu không thì lấy trực tiếp res
      const replyText = res.data?.reply || res.reply || "Xin lỗi, tôi không nhận được câu trả lời.";

      setMessages(prev => [...prev, { sender: 'bot', text: replyText }]);
      
    } catch (error) {
      console.error("Lỗi chat:", error);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: 'Xin lỗi, kết nối đang chập chờn. Bạn thử lại sau nhé! 🔌' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000, fontFamily: 'sans-serif' }}>
      
      {/* 1. NÚT MỞ CHAT (Khi cửa sổ đóng) */}
      {!isOpen && (
        <Tooltip title="Chat với AI tư vấn" placement="left">
            <Button 
                type="primary" 
                shape="circle" 
                size="large" 
                style={{ 
                    width: '60px', 
                    height: '60px', 
                    boxShadow: '0 4px 15px rgba(24, 144, 255, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'bounce 2s infinite' // Tạo hiệu ứng nhún nhảy chú ý
                }}
                icon={<MessageOutlined style={{ fontSize: '28px' }} />}
                onClick={() => setIsOpen(true)}
            />
        </Tooltip>
      )}

      {/* 2. CỬA SỔ CHAT */}
      {isOpen && (
        <div className="animate__animated animate__fadeInUp">
            <Card 
                style={{ 
                    width: '360px', 
                    height: '520px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)', 
                    borderRadius: '16px', 
                    overflow: 'hidden',
                    border: 'none'
                }}
                bodyStyle={{ 
                    flex: 1, 
                    padding: 0, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    height: '100%' 
                }}
            >
                {/* Header */}
                <div style={{ 
                    background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)', 
                    padding: '15px 20px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    color: 'white',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ position: 'relative' }}>
                            <Avatar style={{ backgroundColor: '#fff', color: '#1890ff' }} icon={<RobotOutlined />} size="large" />
                            <span style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, background: '#52c41a', borderRadius: '50%', border: '2px solid white' }}></span>
                        </div>
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>WeHappi AI</div>
                            <div style={{ fontSize: '11px', opacity: 0.9 }}>Luôn sẵn sàng hỗ trợ</div>
                        </div>
                    </div>
                    <div style={{display: 'flex', gap: '5px'}}>
                        <Button type="text" icon={<MinusOutlined style={{color: 'white'}} />} onClick={() => setIsOpen(false)} size="small"/>
                    </div>
                </div>

                {/* Body: Danh sách tin nhắn */}
                <div style={{ 
                    flex: 1, 
                    overflowY: 'auto', 
                    padding: '20px', 
                    backgroundColor: '#f5f7fa',
                    backgroundImage: 'radial-gradient(#e6f7ff 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}>
                    {messages.map((msg, index) => (
                        <div 
                            key={index} 
                            style={{ 
                                display: 'flex', 
                                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', 
                                marginBottom: '15px' 
                            }}
                        >
                            {msg.sender === 'bot' && (
                                <Avatar size="small" icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff', marginRight: '8px', marginTop: '4px' }} />
                            )}
                            
                            <div style={{ 
                                maxWidth: '75%', 
                                padding: '10px 14px', 
                                borderRadius: msg.sender === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                                backgroundColor: msg.sender === 'user' ? '#1890ff' : '#fff',
                                color: msg.sender === 'user' ? '#fff' : '#333',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                fontSize: '14px',
                                lineHeight: '1.5',
                                whiteSpace: 'pre-line' // Để xuống dòng nếu bot trả về \n
                            }}>
                                {msg.text}
                            </div>

                            {msg.sender === 'user' && (
                                <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#87d068', marginLeft: '8px', marginTop: '4px' }} />
                            )}
                        </div>
                    ))}
                    
                    {/* Hiệu ứng đang gõ... */}
                    {isLoading && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginLeft: '35px', color: '#999', fontSize: '12px' }}>
                            <Spin size="small" /> AI đang trả lời...
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Footer: Ô nhập liệu */}
                <div style={{ padding: '15px', background: '#fff', borderTop: '1px solid #eee', display: 'flex', gap: '10px' }}>
                    <Input 
                        placeholder="Hỏi về sản phẩm..." 
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        style={{ borderRadius: '20px', backgroundColor: '#f0f2f5', border: 'none' }}
                        disabled={isLoading}
                    />
                    <Button 
                        type="primary" 
                        shape="circle" 
                        icon={<SendOutlined />} 
                        onClick={handleSend}
                        loading={isLoading}
                        style={{boxShadow: '0 2px 5px rgba(24, 144, 255, 0.3)'}}
                    />
                </div>
            </Card>
        </div>
      )}
    </div>
  );
};

export default ChatBox;