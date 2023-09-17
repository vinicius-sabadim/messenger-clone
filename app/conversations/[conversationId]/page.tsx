import getConversationById from '@/app/actions/getConversationById'
import getMessages from '@/app/actions/getMessages'
import EmptyState from '@/app/components/EmptyState'
import Header from '@/app/conversations/[conversationId]/components/Header'
import Body from '@/app/conversations/[conversationId]/components/Body'
import Form from '@/app/conversations/[conversationId]/components/Form'

interface IParams {
  conversationId: string
}

const ConversationId = async ({ params }: { params: IParams }) => {
  const { conversationId } = params

  const conversation = await getConversationById(conversationId)
  const messages = await getMessages(conversationId)

  if (!conversation) {
    return (
      <div className='h-full lg:pl-80'>
        <div className='flex h-full flex-col'>
          <EmptyState />
        </div>
      </div>
    )
  }

  return (
    <div className='h-full lg:pl-80'>
      <div className='flex h-full flex-col'>
        <Header conversation={conversation} />
        <Body />
        <Form />
      </div>
    </div>
  )
}

export default ConversationId
