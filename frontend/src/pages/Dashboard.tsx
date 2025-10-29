import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Button, Input, Select, Row, Col, Typography, Space, Skeleton, Empty } from 'antd';
import { PlusOutlined, SearchOutlined, FileTextOutlined } from '@ant-design/icons';
import { RequestTypeCard } from '../components/RequestTypeCard';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';
import { useRequestTypesStore } from '../store/requestTypesStore';
import { toast } from 'sonner';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    fetchRequestTypes,
    deleteRequestType,
    loading,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    getFilteredRequestTypes,
  } = useRequestTypesStore();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRequestType, setSelectedRequestType] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch request types whenever we navigate to this route
  useEffect(() => {
    fetchRequestTypes();
  }, [fetchRequestTypes, location.key]); // location.key changes on navigation

  const filteredRequestTypes = getFilteredRequestTypes();

  const handleDelete = (id: string, name: string) => {
    setSelectedRequestType({ id, name });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedRequestType) return;

    setDeleting(true);
    try {
      await deleteRequestType(selectedRequestType.id);
      setDeleteDialogOpen(false);
      setSelectedRequestType(null);
    } catch (error) {
      toast.error('Failed to delete request type');
    } finally {
      toast.success('Request type deleted successfully');
      setDeleting(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <Header style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', height: 'auto', padding: 0 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 24px' }}>
          <Row gutter={[16, 16]} justify="space-between" align="middle">
            <Col xs={24} sm={24} md={16}>
              <Title level={2} style={{ margin: 0 }}>Intake Builder</Title>
              <Text style={{fontSize: "30px"}} type="secondary">Manage request types for your AI system</Text>
            </Col>
            <Col xs={24} sm={24} md={8} style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={() => navigate('/create')}
                block={window.innerWidth < 768}
              >
                Create Request Type
              </Button>
            </Col>
          </Row>
        </div>
      </Header>

      {/* Filters */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px', width: '100%' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={16}>
            <Input
              placeholder="Search by name, owner, or purpose..."
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="large"
            />
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Select
              value={sortBy}
              onChange={(value) => setSortBy(value)}
              size="large"
              style={{ width: '100%' }}
              options={[
                { value: 'newest', label: 'Newest First' },
                { value: 'oldest', label: 'Oldest First' },
                { value: 'name-asc', label: 'Name (A-Z)' },
                { value: 'name-desc', label: 'Name (Z-A)' }
              ]}
            />
          </Col>
        </Row>
      </div>

      {/* Content */}
      <Content style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 48px', width: '100%' }}>
        {loading ? (
          <Row gutter={[24, 24]}>
            {[1, 2, 3].map((i) => (
              <Col xs={24} sm={12} lg={8} key={i}>
                <Skeleton.Node active style={{ width: '100%', height: '280px' }}>
                  <div />
                </Skeleton.Node>
              </Col>
            ))}
          </Row>
        ) : filteredRequestTypes.length === 0 ? (
          <Empty
            image={<FileTextOutlined style={{ fontSize: 64, color: '#1890ff' }} />}
            description={
              <Space direction="vertical" size="small">
                <Title level={4}>{searchQuery ? 'No results found' : 'No Request Types Yet'}</Title>
                <Text type="secondary">
                  {searchQuery
                    ? 'Try adjusting your search query or filters'
                    : 'Get started by creating your first request type to help our AI collect the right information.'}
                </Text>
              </Space>
            }
          >
            {!searchQuery && (
              <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/create')}>
                Create Your First Request Type
              </Button>
            )}
            {searchQuery && (
              <Button onClick={() => setSearchQuery('')}>Clear Search</Button>
            )}
          </Empty>
        ) : (
          <Row gutter={[24, 24]}>
            {filteredRequestTypes.map((requestType) => (
              <Col xs={24} sm={12} lg={8} key={requestType.id}>
                <RequestTypeCard
                  requestType={requestType}
                  onDelete={(id) => handleDelete(id, requestType.requestType)}
                />
              </Col>
            ))}
          </Row>
        )}
      </Content>

      {/* Delete Confirmation Dialog */}
      {selectedRequestType && (
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          requestTypeName={selectedRequestType.name}
          loading={deleting}
        />
      )}
    </Layout>
  );
}
