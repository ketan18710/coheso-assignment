import { useState } from 'react';
import { Card, Button, Input, Select, Checkbox, Space, Typography } from 'antd';
import { HolderOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Field } from '../types';

const { Text } = Typography;

interface FieldBuilderProps {
  fields: Field[];
  onChange: (fields: Field[]) => void;
}

function SortableField({ field, onUpdate, onDelete }: { field: Field; onUpdate: (field: Field) => void; onDelete: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [showOptions, setShowOptions] = useState(field.type === 'select');

  const handleTypeChange = (newType: Field['type']) => {
    onUpdate({ ...field, type: newType });
    setShowOptions(newType === 'select');
  };

  const addOption = () => {
    const newOptions = [...(field.options || []), ''];
    onUpdate({ ...field, options: newOptions });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(field.options || [])];
    newOptions[index] = value;
    onUpdate({ ...field, options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = field.options?.filter((_, i) => i !== index);
    onUpdate({ ...field, options: newOptions });
  };

  return (
    <Card ref={setNodeRef} style={style} size="small">
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
        <button
          type="button"
          style={{
            cursor: 'grab',
            border: 'none',
            background: 'none',
            padding: '4px',
            marginTop: '4px',
            color: '#8c8c8c'
          }}
          {...attributes}
          {...listeners}
        >
          <HolderOutlined style={{ fontSize: '18px' }} />
        </button>

        <div style={{ flex: 1 }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: '1fr 1fr' }}>
              <div>
                <Text strong>Label *</Text>
                <Input
                  value={field.label}
                  onChange={(e) => onUpdate({ ...field, label: e.target.value })}
                  placeholder="Field label"
                  style={{ marginTop: 4 }}
                />
              </div>
              <div>
                <Text strong>Type *</Text>
                <Select
                  value={field.type}
                  onChange={handleTypeChange}
                  style={{ width: '100%', marginTop: 4 }}
                  options={[
                    { value: 'text', label: 'Text' },
                    { value: 'long-text', label: 'Long Text' },
                    { value: 'date', label: 'Date' },
                    { value: 'select', label: 'Select' }
                  ]}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: '1fr auto' }}>
              <div>
                <Text strong>Placeholder</Text>
                <Input
                  value={field.placeholder || ''}
                  onChange={(e) => onUpdate({ ...field, placeholder: e.target.value })}
                  placeholder="Placeholder text"
                  style={{ marginTop: 4 }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '4px' }}>
                <Checkbox
                  checked={field.required}
                  onChange={(e) => onUpdate({ ...field, required: e.target.checked })}
                >
                  Required
                </Checkbox>
              </div>
            </div>

            {showOptions && field.type === 'select' && (
              <div>
                <Text strong>Options *</Text>
                <Space direction="vertical" size="small" style={{ width: '100%', marginTop: 4 }}>
                  {field.options?.map((option, index) => (
                    <Space.Compact key={index} style={{ width: '100%' }}>
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                      />
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeOption(index)}
                      />
                    </Space.Compact>
                  ))}
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={addOption}
                    block
                  >
                    Add Option
                  </Button>
                </Space>
              </div>
            )}
          </Space>
        </div>

        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={onDelete}
        />
      </div>
    </Card>
  );
}

export function FieldBuilder({ fields, onChange }: FieldBuilderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      onChange(arrayMove(fields, oldIndex, newIndex));
    }
  };

  const addField = () => {
    const newField: Field = {
      id: `field-${Date.now()}`,
      label: '',
      type: 'text',
      required: false,
      placeholder: '',
    };
    onChange([...fields, newField]);
  };

  const updateField = (index: number, updatedField: Field) => {
    const newFields = [...fields];
    newFields[index] = updatedField;
    onChange(newFields);
  };

  const deleteField = (index: number) => {
    onChange(fields.filter((_, i) => i !== index));
  };

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text strong style={{ fontSize: '16px' }}>Fields to Collect</Text>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={addField}
        >
          Add Field
        </Button>
      </div>

      {fields.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '32px' }}>
          <Text type="secondary">No fields yet. Click "Add Field" to create one.</Text>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {fields.map((field, index) => (
                <SortableField
                  key={field.id}
                  field={field}
                  onUpdate={(updatedField) => updateField(index, updatedField)}
                  onDelete={() => deleteField(index)}
                />
              ))}
            </Space>
          </SortableContext>
        </DndContext>
      )}
    </Space>
  );
}
