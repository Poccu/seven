import { FC, useState } from 'react'
import { Box, Divider, Stack, styled } from '@mui/material'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import { useAuth } from '../../providers/useAuth'
import { doc, runTransaction } from 'firebase/firestore'
import { ThemeAvatar } from '../../ui/ThemeAvatar'
import { ArrowForwardIosSharp } from '@mui/icons-material'
import { IPost } from '../../../types'
import { ThemeTextFieldAddComment } from '../../ui/ThemeTextField'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AddEmoji } from './AddEmoji'

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  // marginTop: '0px',
  // height: '0px',
  // borderBottom: `2px solid ${theme.palette.divider}`,
  // sx: {
  //   pointerEvents: 'none',
  // },
}))

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={
      <ArrowForwardIosSharp
        sx={{ fontSize: '26px', pointerEvents: 'auto' }}
        color="secondary"
      />
    }
    {...props}
  />
))(({ theme }) => ({
  minHeight: '0px',
  heigh: '0px',
  backgroundColor: theme.palette.background.paper,
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(0deg)',
  },
  '& .MuiAccordionSummary-content': {
    // marginLeft: theme.spacing(1),
  },
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: '30px 0px 0px 0px',
}))

type Props = {
  expanded: string | false
  post: IPost
}

export const AddComment: FC<Props> = ({ expanded, post }) => {
  const { t } = useTranslation(['news'])
  const [content, setContent] = useState('')
  const { cur, db, user } = useAuth()

  const handleAddComment = async (e: any) => {
    if (e.key === 'Enter' && content.trim()) {
      let charList =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'

      let idDb = ''

      if (charList) {
        let x = 20
        while (x > 0) {
          let index = Math.floor(Math.random() * charList.length) // pick random index from charList
          idDb += charList[index]
          x--
        }
      }

      const docRef = doc(db, 'posts', post.id)

      try {
        await runTransaction(db, async (transaction) => {
          const sfDoc = await transaction.get(docRef)
          if (!sfDoc.exists()) {
            throw 'Document does not exist!'
          }
          const newCommentsArr = [
            ...sfDoc.data().comments,
            {
              author: {
                uid: cur.uid,
                displayName: cur.displayName,
                photoURL: cur.photoURL,
                emoji: user?.emoji,
              },
              content,
              createdAt: Date.now(),
              images: [],
              likes: [],
              id: idDb,
            },
          ]
          transaction.update(docRef, {
            comments: newCommentsArr,
          })
        })
      } catch (e) {
        console.log('Comments Add failed: ', e)
      }
      setContent('')
      e.target.blur()
    }
  }

  return (
    <Box sx={{ mt: 0 }}>
      {/* <Accordion
        // expanded={expanded === post.id}
        expanded={true}
      > */}
      {/* <AccordionSummary
          sx={{
            pointerEvents: 'none',
          }}
          expandIcon={null}
          aria-controls="panel1a-content"
          id="panel1a-header"
        ></AccordionSummary> */}
      {/* <AccordionDetails> */}
      <Divider sx={{ mt: 2, mb: 3 }} />
      <Stack alignItems="center" direction="row" spacing={2}>
        <Link to={`/profile/${cur.uid}`}>
          <ThemeAvatar alt={cur.displayName} src={cur.photoURL}>
            {user?.emoji}
          </ThemeAvatar>
        </Link>
        <ThemeTextFieldAddComment
          label={t('line2')}
          // multiline
          fullWidth
          // focused
          autoComplete="off"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={handleAddComment}
        />
        <AddEmoji setContent={setContent} />
      </Stack>
      {/* </AccordionDetails> */}
      {/* </Accordion> */}
    </Box>
  )
}
