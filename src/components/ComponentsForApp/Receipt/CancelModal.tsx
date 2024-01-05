import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from '@material-ui/core'
import { Cancel, Save } from '@material-ui/icons'
import axios, { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import ReceiptService from '../../../services/Receipt'
import { UserContextType } from '../../../schemas/User'
import UserContext from '../../../contexts/User'
import { ServerError } from '../../../schemas/Error'

const texts = {
  img: process.env.PUBLIC_URL + '/images/warning.jpg',
  title: 'Anular recibo',
  subtitle: 'Esta acción es irreversible, los movimientos en las cuentas afectadas en el recibo serán revertidos'
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%'
    },
    buttonContainer: {
      textAlign: 'right',
      width: '100%',
      padding: 10
    },
    button: {
      marginLeft: 10
    },
    media: {
      height: 300
    }
  }),
)

interface Props {
  show: boolean
  code: string
  handleModal: (show: boolean) => void
}

export default function CancelModal(props: Props) {
  const classes = useStyles()
  const { userContext } = React.useContext(
    UserContext
  ) as UserContextType

  async function cancelReceipt() {
    try {
      const receiptService = new ReceiptService()
      const canceledReceipt = await receiptService.cancelReceipt(userContext.token ?? '', props.code)
      props.handleModal(false)
      return toast.success(`El comprobante ${canceledReceipt.code} fue anulado con éxito`)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<ServerError>
        if (serverError && serverError.response) {
          return toast.error(serverError.response.data.message)
        }
      } else if (error instanceof Error) {
        return toast.error(error.message)
      }
    }
  }

  return (
    <Modal
      open={props.show}
      onClose={() => props.handleModal(false)}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div className={classes.root}>
        <Card>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image={texts.img}
              title='Información importante'
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {texts.title} {props.code}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {texts.subtitle}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <div className={classes.buttonContainer}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<Save />}
                onClick={cancelReceipt}
                className={classes.button}
              >
                Aceptar
              </Button>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                startIcon={<Cancel />}
                className={classes.button}
                onClick={() => props.handleModal(false)}
              >
                Cancelar
              </Button>
            </div>
          </CardActions>
        </Card>

      </div>
    </Modal>
  )
}
