import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Button, Input, Typography, Card, Space, Form, App } from 'antd';
import { ArrowLeftOutlined, LoadingOutlined } from '@ant-design/icons';
import { FieldBuilder } from '../components/FieldBuilder';
import { requestTypesApi } from '../lib/api';
import { useRequestTypesStore } from '../store/requestTypesStore';
import { toast } from 'sonner';
import type { Field } from '../types';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

export function CreateRequestType() {
  const navigate = useNavigate();
  const { modal } = App.useApp();
  const { addRequestType } = useRequestTypesStore();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    requestType: '',
    purpose: '',
    owner: '',
    fields: [] as Field[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.requestType.trim()) {
      newErrors.requestType = 'Request type name is required';
    }

    if (!formData.purpose.trim() || formData.purpose.length < 10) {
      newErrors.purpose = 'Purpose must be at least 10 characters';
    }

    if (!formData.owner.trim()) {
      newErrors.owner = 'Owner email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.owner)) {
      newErrors.owner = 'Please enter a valid email address';
    }

    // Validate fields
    formData.fields.forEach((field, index) => {
      if (!field.label.trim()) {
        newErrors[`field-${index}-label`] = 'Field label is required';
      }
      if (field.type === 'select' && (!field.options || field.options.length === 0 || field.options.some(o => !o.trim()))) {
        newErrors[`field-${index}-options`] = 'Select fields must have at least one non-empty option';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      const newRequestType = await requestTypesApi.create(formData);
      addRequestType(newRequestType);
      toast.success('Request type created successfully!');
      navigate('/');
    } catch (error: any) {
      console.error('Error creating request type:', error);
      toast.error(error.response?.data?.error || 'Failed to create request type');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const hasChanges = 
      formData.requestType.trim() !== '' ||
      formData.purpose.trim() !== '' ||
      formData.owner.trim() !== '' ||
      formData.fields.length > 0;
    
    if (hasChanges) {
      modal.confirm({
        title: 'Unsaved Changes',
        content: 'You have unsaved changes. Are you sure you want to leave?',
        okText: 'Leave',
        okType: 'danger',
        cancelText: 'Stay',
        onOk: () => {
          navigate('/');
        },
      });
    } else {
      navigate('/');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <Header style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', height: 'auto', padding: 0 }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 1rem' }} className="header-content">
          <Button
            type="default"
            icon={<ArrowLeftOutlined />}
            onClick={handleCancel}
            style={{ 
              marginBottom: '16px',
              borderColor: '#d9d9d9',
              color: '#595959',
              fontWeight: 500
            }}
          >
            Back to Dashboard
          </Button>
          <Title level={2} style={{ margin: 0 }}>Create Request Type</Title>
          <Text type="secondary">Define a new request type for your AI system to collect information</Text>
        </div>
      </Header>

      {/* Form */}
      <Content 
        style={{ 
          maxWidth: '960px', 
          margin: '0 auto', 
          padding: '32px 0.2rem', 
          width: '100%'
        }}
        className="form-content"
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Basic Information */}
          <Card title={<Text strong style={{ fontSize: '16px' }}>Basic Information</Text>}>
            <Form layout="vertical">
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: '15px' }}>Request Type Name</span>}
                required
                validateStatus={errors.requestType ? 'error' : ''}
                help={errors.requestType}
              >
                <Input
                  size="large"
                  value={formData.requestType}
                  onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                  placeholder="e.g., NDA Request - Sales"
                />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: '15px' }}>Purpose</span>}
                required
                validateStatus={errors.purpose ? 'error' : ''}
                help={errors.purpose || 'Minimum 10 characters. This helps our AI identify when to use this form.'}
              >
                <TextArea
                  size="large"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="Describe when this form should be used. This helps the AI identify the right request type..."
                  rows={4}
                  showCount
                />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: '15px' }}>Owner Email</span>}
                required
                validateStatus={errors.owner ? 'error' : ''}
                help={errors.owner || 'Responsible person for questions about this request type'}
              >
                <Input
                  size="large"
                  type="email"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  placeholder="legal@company.com"
                />
              </Form.Item>
            </Form>
          </Card>

          {/* Fields */}
          <Card title={<Text strong style={{ fontSize: '16px' }}>Information to Collect</Text>}>
            <FieldBuilder
              fields={formData.fields}
              onChange={(fields) => setFormData({ ...formData, fields })}
            />
            {Object.keys(errors).some(key => key.startsWith('field-')) && (
              <Text type="danger" style={{ display: 'block', marginTop: '16px' }}>
                Please fix the errors in your fields
              </Text>
            )}
          </Card>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button size="large" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={handleSubmit}
              loading={loading}
              icon={loading ? <LoadingOutlined /> : null}
            >
              Create Request Type
            </Button>
          </div>
        </Space>
      </Content>
      
      <style>{`
        @media (min-width: 768px) {
          .header-content {
            padding: 24px !important;
          }
          .form-content {
            padding: 32px 24px !important;
          }
        }
      `}</style>
    </Layout>
  );
}
