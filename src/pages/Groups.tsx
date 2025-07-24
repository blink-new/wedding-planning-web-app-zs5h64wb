import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Users, Heart, Crown, UsersRound, Settings } from 'lucide-react'

interface Group {
  id: string
  name: string
  description: string
  memberCount: number
  color: string
  icon: React.ReactNode
  isDefault: boolean
}

export default function Groups() {
  // Hardcoded default groups - always visible
  const defaultGroups: Group[] = [
    {
      id: 'all-guests',
      name: 'All Guests',
      description: 'Everyone invited to your wedding',
      memberCount: 0,
      color: 'border-wedding-primary bg-wedding-primary/5',
      icon: <UsersRound className="h-5 w-5 text-wedding-primary" />,
      isDefault: true
    },
    {
      id: 'family',
      name: 'Family',
      description: 'Close family members from both sides',
      memberCount: 0,
      color: 'border-amber-600 bg-amber-50',
      icon: <Heart className="h-5 w-5 text-amber-600" />,
      isDefault: true
    },
    {
      id: 'friends',
      name: 'Friends',
      description: 'Close friends and college buddies',
      memberCount: 0,
      color: 'border-yellow-600 bg-yellow-50',
      icon: <Users className="h-5 w-5 text-yellow-600" />,
      isDefault: true
    },
    {
      id: 'bridal-party',
      name: 'Bridal Party',
      description: 'Bridesmaids, groomsmen, and wedding party',
      memberCount: 0,
      color: 'border-pink-600 bg-pink-50',
      icon: <Crown className="h-5 w-5 text-pink-600" />,
      isDefault: true
    }
  ]

  const [customGroups, setCustomGroups] = useState<Group[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupDescription, setNewGroupDescription] = useState('')

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return

    const newGroup: Group = {
      id: `custom-${Date.now()}`,
      name: newGroupName.trim(),
      description: newGroupDescription.trim(),
      memberCount: 0,
      color: 'border-gray-300 bg-gray-50',
      icon: <Users className="h-5 w-5 text-gray-600" />,
      isDefault: false
    }

    setCustomGroups(prev => [...prev, newGroup])
    setNewGroupName('')
    setNewGroupDescription('')
    setIsCreateDialogOpen(false)
  }

  const allGroups = [...defaultGroups, ...customGroups]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif text-gray-900">Guest Groups</h1>
          <p className="text-gray-600 mt-2">Organize your guests into groups for targeted messaging</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-wedding-primary hover:bg-wedding-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  id="groupName"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g., College Friends"
                />
              </div>
              <div>
                <Label htmlFor="groupDescription">Description (Optional)</Label>
                <Textarea
                  id="groupDescription"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="Brief description of this group"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateGroup} className="bg-wedding-primary hover:bg-wedding-primary/90">
                  Create Group
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Default Groups Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Default Groups</h2>
          <Badge variant="secondary" className="bg-wedding-primary/10 text-wedding-primary">
            Pre-built
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {defaultGroups.map((group) => (
            <Card key={group.id} className={`${group.color} border-2 hover:shadow-md transition-shadow`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {group.icon}
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{group.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {group.memberCount} members
                  </span>
                  <Button size="sm" variant="outline">
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Custom Groups Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Custom Groups</h2>
        {customGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {customGroups.map((group) => (
              <Card key={group.id} className={`${group.color} border-2 hover:shadow-md transition-shadow`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {group.icon}
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{group.description || 'No description'}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {group.memberCount} members
                    </span>
                    <Button size="sm" variant="outline">
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Custom Groups Yet</h3>
              <p className="text-gray-600 text-center mb-4">
                Create custom groups like "College Friends" or "Work Colleagues" to organize your guests
              </p>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-wedding-primary hover:bg-wedding-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Group
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Summary Stats */}
      <Card className="bg-gradient-to-r from-wedding-primary/5 to-wedding-primary/10 border-wedding-primary/20">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-wedding-primary">{allGroups.length}</div>
              <div className="text-sm text-gray-600">Total Groups</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-wedding-primary">
                {allGroups.reduce((sum, group) => sum + group.memberCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Members</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-wedding-primary">{defaultGroups.length}</div>
              <div className="text-sm text-gray-600">Default Groups</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}