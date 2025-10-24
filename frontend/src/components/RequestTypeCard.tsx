import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Typography, Space } from 'antd';
import { EditOutlined, DeleteOutlined, MailOutlined, CalendarOutlined } from '@ant-design/icons';
import type { RequestType } from '../types';
import { formatDate } from '../lib/utils';

const { Text, Paragraph } = Typography;

interface RequestTypeCardProps {
  requestType: RequestType;
  onDelete: (id: string) => void;
}

export function RequestTypeCard({ requestType, onDelete }: RequestTypeCardProps) {
  const navigate = useNavigate();
  const [showFullPurpose, setShowFullPurpose] = useState(false);

  return (
    <Card
      hoverable
      style={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '280px',
        transition: 'all 0.3s ease'
      }}
      bodyStyle={{ 
        display: 'flex', 
        flexDirection: 'column', 
        flex: 1,
        padding: '20px'
      }}
      headStyle={{
        borderBottom: 'none',
        paddingBottom: '8px',
        paddingTop: '12px'
      }}
      className="request-type-card"
      extra={
        <Space style={{ marginTop: '-8px' }}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/edit/${requestType.id}`)}
            className="card-action-btn"
            size="small"
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(requestType.id)}
            className="card-action-btn"
            size="small"
          />
        </Space>
      }
      title={
        <div 
          style={{ 
            maxWidth: 'calc(100% - 80px)', // Leave space for action buttons
            height: 'auto',
            minHeight: '1.75rem', // At least 1 line
            maxHeight: '3.5rem', // Maximum 2 lines
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: '1.75rem',
            fontSize: '16px',
            fontWeight: 600,
            color: 'rgba(0, 0, 0, 0.88)',
            wordBreak: 'break-word',
            whiteSpace: 'normal'
          }}
          title={requestType.requestType}
        >
          {requestType.requestType}
        </div>
      }
    >
      <div style={{ flex: 1 }}>
        <Paragraph
          style={{ 
            cursor: 'pointer',
            marginBottom: '16px'
          }}
          onClick={() => setShowFullPurpose(!showFullPurpose)}
          title="Click to see full purpose"
          ellipsis={showFullPurpose ? false : { rows: 3 }}
        >
          {requestType.purpose}
        </Paragraph>
      </div>

      <Space direction="vertical" size="small" style={{ width: '100%', marginTop: 'auto' }}>
        <div>
          <Text strong>{requestType.fields.length}</Text>
          <Text type="secondary"> {requestType.fields.length === 1 ? 'field' : 'fields'}</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
          <MailOutlined style={{ marginRight: 8, flexShrink: 0 }} />
          <Text 
            type="secondary" 
            ellipsis={{ tooltip: requestType.owner }}
            style={{ flex: 1, minWidth: 0 }}
          >
            {requestType.owner}
          </Text>
        </div>
        <div>
          <CalendarOutlined style={{ marginRight: 8 }} />
          <Text type="secondary">Created {formatDate(requestType.createdAt)}</Text>
        </div>
      </Space>

      <style>{`
        .request-type-card .card-action-btn {
          opacity: 1;
        }
        @media (min-width: 1024px) {
          .request-type-card .card-action-btn {
            opacity: 0;
            transition: opacity 0.2s ease;
          }
          .request-type-card:hover .card-action-btn {
            opacity: 1;
          }
        }
      `}</style>
    </Card>
  );
}
